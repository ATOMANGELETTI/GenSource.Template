//! Shared Tauri state, registered via `Builder::manage` in `lib.rs`.

use std::sync::Mutex;

/// Minimal example of in-memory app state. Extend with real fields as
/// commands need shared, mutable data.
#[derive(Default)]
pub struct AppState {
    pub greet_count: Mutex<u64>,
}
