//! GenSource Template Tauri v2 app library. Registers all desktop plugins,
//! shared state, and IPC commands, then hands off to the Tauri runtime.

// Prebuilt libsodium (via tauri-plugin-stronghold) emits MSVC LNK4099/LNK4098
// on Windows debug links; allow until upstream ships matching PDBs/CRT.
#![cfg_attr(all(windows, target_env = "msvc"), allow(linker_messages))]

#[path = "commands/commands.rs"]
mod commands;
mod config;
#[path = "mdoels/models.rs"]
mod mdoels;
#[path = "state/state.rs"]
mod state;

use tauri::image::Image;
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{Manager, RunEvent, WindowEvent};
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_positioner::{Position, WindowExt};

use state::AppState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default();

    // Single-instance must be registered before any other plugin so it can
    // observe the deep-link argv on a second launch. Desktop-only: there is
    // no concept of "another instance" on mobile.
    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, argv, _cwd| {
            log::info!("second instance launched with args: {argv:?}");
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
            }
        }));
    }

    builder = builder
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        // `plugins.updater` in tauri.conf.json must include `pubkey` (required
        // by the plugin Config deserializer) or startup fails. Placeholder
        // empty pubkey/endpoints are fine for template builds; set a real
        // pubkey and endpoints (or Builder `.pubkey()`/`.endpoints()`) before
        // shipping updates.
        .plugin(tauri_plugin_updater::Builder::new().build())
        // SQLite database is opened lazily from the frontend, e.g.
        // `Database.load("sqlite:gensource.db")`; the path resolves under
        // the app's data directory (see `fs`/`sql` capability scopes).
        .plugin(tauri_plugin_sql::Builder::new().build())
        // Synced from settings.json `autostart` on startup / settings reload.
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            None,
        ))
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_persisted_scope::init())
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_websocket::init())
        .plugin(tauri_plugin_cli::init())
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![
            commands::greet,
            commands::get_app_info,
            commands::get_settings,
            commands::reload_settings,
            commands::get_keybindings,
            commands::open_configs_folder,
            commands::hide_main_window,
            commands::quit_app,
        ])
        .setup(|app| {
            // Stronghold needs a filesystem path for its key-derivation
            // salt, which is only resolvable once the app handle exists, so
            // it is registered here instead of the plugin chain above.
            // Vaults are opened lazily via the `stronghold.initialize`
            // frontend/JS command with a user-supplied password — nothing
            // here touches disk or panics at startup.
            let salt_path = app
                .path()
                .app_local_data_dir()
                .expect("app_local_data_dir should be resolvable")
                .join("stronghold-salt.txt");
            app.handle()
                .plugin(tauri_plugin_stronghold::Builder::with_argon2(&salt_path).build())?;

            // Register all desktop deep-link schemes at runtime too, so
            // `gensource://...` works for unpackaged dev builds on Windows
            // and Linux (macOS relies solely on the static config).
            #[cfg(any(windows, target_os = "linux"))]
            {
                use tauri_plugin_deep_link::DeepLinkExt;
                let _ = app.deep_link().register_all();
            }

            let configs_dir = config::resolve_configs_dir(app.handle());
            if let Err(err) = config::ensure_config_files(&configs_dir) {
                log::warn!("ensure config files: {err}");
            }

            let settings = config::load_settings(&configs_dir);
            let keybindings = config::load_keybindings(&configs_dir);
            let product_name = config::load_appinfo(&configs_dir)
                .map(|info| {
                    if !info.product_name.trim().is_empty() {
                        info.product_name
                    } else {
                        info.name
                    }
                })
                .unwrap_or_else(|| "GenSource Template".into());

            {
                let state = app.state::<AppState>();
                *state
                    .configs_dir
                    .lock()
                    .unwrap_or_else(|p| p.into_inner()) = Some(configs_dir.clone());
                *state.settings.lock().unwrap_or_else(|p| p.into_inner()) = settings.clone();
            }

            if let Some(window) = app.get_webview_window("main") {
                config::apply_always_on_top(&window, &settings);
                config::apply_start_minimized(&window, &settings);
            }

            config::apply_autostart(app.handle(), settings.autostart);
            config::register_keybindings(app.handle(), &keybindings);
            config::emit_settings_changed(app.handle(), &settings);
            config::start_settings_watcher(app.handle().clone(), configs_dir);

            // System tray uses the bundled PNG (RGBA) so the notification-area
            // glyph stays sharp with transparency on Windows. The right-click
            // menu is a real flat-styled window (`tray-menu`, declared in
            // tauri.conf.json) instead of a native OS menu, so it always
            // matches the app's own theme. Left click still shows/focuses
            // `main`, matching common tray UX.
            let tray_icon = Image::from_bytes(include_bytes!("../icons/32x32.png"))?;

            TrayIconBuilder::new()
                .icon(tray_icon)
                .tooltip(&product_name)
                .on_tray_icon_event(|tray, event| {
                    let app = tray.app_handle();
                    // Required by tauri-plugin-positioner to know where the
                    // tray icon is before `Position::TrayCenter` can be used.
                    tauri_plugin_positioner::on_tray_event(app, &event);

                    match event {
                        TrayIconEvent::Click {
                            button: MouseButton::Left,
                            button_state: MouseButtonState::Up,
                            ..
                        } => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        TrayIconEvent::Click {
                            button: MouseButton::Right,
                            button_state: MouseButtonState::Up,
                            ..
                        } => {
                            if let Some(menu) = app.get_webview_window("tray-menu") {
                                let _ = menu.as_ref().window().move_window(Position::TrayCenter);
                                let _ = menu.show();
                                let _ = menu.set_focus();
                            }
                        }
                        _ => {}
                    }
                })
                .build(app)?;

            // Dismiss the tray flyout as soon as it loses focus (clicking
            // elsewhere, or an item invoking a command) instead of closing
            // it, so the next right-click reopens instantly.
            if let Some(menu) = app.get_webview_window("tray-menu") {
                let hideable = menu.clone();
                menu.on_window_event(move |event| {
                    if let WindowEvent::Focused(false) = event {
                        let _ = hideable.hide();
                    }
                });
            }

            Ok(())
        });

    builder
        .build(tauri::generate_context!())
        .expect("error while building the GenSource Template app")
        .run(|_app_handle, event| {
            if let RunEvent::ExitRequested { .. } = event {
                log::info!("GenSource Template is exiting");
            }
        });
}
