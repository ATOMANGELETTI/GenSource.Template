//! Shared Tauri state, registered via `Builder::manage` in `lib.rs`.

use std::path::PathBuf;
use std::sync::{Arc, Mutex, RwLock};

use crate::mdoels::{AppSettings, LoggingSettings};

/// In-memory app state shared across commands and the config watcher.
pub struct AppState {
    pub greet_count: Mutex<u64>,
    pub configs_dir: Mutex<Option<PathBuf>>,
    /// Live settings, kept in sync with `settings.json`.
    pub settings: Mutex<AppSettings>,
    /// Live logging toggles, shared with the log plugin filter.
    pub logging: Arc<RwLock<LoggingSettings>>,
}

impl AppState {
    pub fn new(logging: Arc<RwLock<LoggingSettings>>) -> Self {
        Self {
            greet_count: Mutex::new(0),
            configs_dir: Mutex::new(None),
            settings: Mutex::new(AppSettings::default()),
            logging,
        }
    }
}

impl Default for AppState {
    fn default() -> Self {
        Self::new(Arc::new(RwLock::new(LoggingSettings::default())))
    }
}
