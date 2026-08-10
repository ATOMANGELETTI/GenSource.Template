//! GenSource Template Tauri v2 app library. Registers all desktop plugins,
//! shared state, and IPC commands, then hands off to the Tauri runtime.

#[path = "commands/commands.rs"]
mod commands;
#[path = "mdoels/models.rs"]
mod mdoels;
#[path = "state/state.rs"]
mod state;

use tauri::menu::{Menu, MenuItem};
use tauri::tray::TrayIconBuilder;
use tauri::{Manager, RunEvent};
use tauri_plugin_autostart::MacosLauncher;

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
        // Registered but left disabled: call `enable()` from the frontend to
        // opt the user into launch-at-login.
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

            // Best-effort system tray: skip entirely if no window icon was
            // configured (e.g. `icons/` placeholders not yet generated)
            // rather than failing the build/startup.
            if let Some(icon) = app.default_window_icon().cloned() {
                let show_item = MenuItem::with_id(app, "show", "Show", true, None::<&str>)?;
                let quit_item = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
                let tray_menu = Menu::with_items(app, &[&show_item, &quit_item])?;

                TrayIconBuilder::new()
                    .icon(icon)
                    .menu(&tray_menu)
                    .show_menu_on_left_click(true)
                    .on_menu_event(|app, event| match event.id.as_ref() {
                        "quit" => app.exit(0),
                        "show" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        _ => {}
                    })
                    .build(app)?;
            } else {
                log::warn!("no default window icon configured; skipping system tray");
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
