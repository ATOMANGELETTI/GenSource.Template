//! Shared Tauri state, registered via `Builder::manage` in `lib.rs`.

use std::path::PathBuf;
use std::sync::Mutex;

use crate::mdoels::AppSettings;

/// In-memory app state shared across commands and the config watcher.
pub struct AppState {
    pub greet_count: Mutex<u64>,
    pub configs_dir: Mutex<Option<PathBuf>>,
    /// Live settings, kept in sync with `settings.json`.
    pub settings: Mutex<AppSettings>,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            greet_count: Mutex::new(0),
            configs_dir: Mutex::new(None),
            settings: Mutex::new(AppSettings::default()),
        }
    }
}
