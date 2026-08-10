//! `#[tauri::command]` handlers. Register new commands in the
//! `invoke_handler![...]` list in `lib.rs`.

use tauri::{AppHandle, State};

use crate::mdoels::AppInfo;
use crate::state::AppState;

/// Simple example command: greets `name` and tracks how many times any
/// window has called it via `AppState::greet_count`.
#[tauri::command]
pub fn greet(state: State<'_, AppState>, name: &str) -> String {
    let mut count = state.greet_count.lock().unwrap_or_else(|poisoned| poisoned.into_inner());
    *count += 1;
    format!("Hello, {name}! You've been greeted {count} time(s) from Rust.")
}

/// Returns basic metadata about the running application.
#[tauri::command]
pub fn get_app_info(app: AppHandle) -> AppInfo {
    let package_info = app.package_info();
    let description = package_info.description.trim();
    AppInfo {
        name: package_info.name.clone(),
        version: package_info.version.to_string(),
        description: if description.is_empty() {
            None
        } else {
            Some(description.to_string())
        },
    }
}
