//! Shared data models. Note: this directory is intentionally named `mdoels`
//! (a pre-existing typo in the template); preserve it unless asked to rename.

use serde::{Deserialize, Serialize};

/// Basic metadata about the running application, exposed to the frontend
/// via the `get_app_info` command. Mirrors `AppInfo` in
/// `src/app/types/index.ts`.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppInfo {
    pub name: String,
    pub version: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
}
