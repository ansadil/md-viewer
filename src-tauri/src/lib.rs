use std::sync::Mutex;
use tauri::Manager;

struct PendingFile(Mutex<Option<String>>);

#[tauri::command]
fn read_md_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(&path).map_err(|e| format!("Failed to read file: {}", e))
}

#[tauri::command]
fn get_pending_file(state: tauri::State<PendingFile>) -> Option<String> {
    state.0.lock().unwrap().take()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(PendingFile(Mutex::new(None)))
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![read_md_file, get_pending_file])
        .setup(|app| {
            let arg = std::env::args().nth(1);
            if let Some(p) = arg {
                if p.ends_with(".md") || p.ends_with(".markdown") {
                    let state = app.state::<PendingFile>();
                    *state.0.lock().unwrap() = Some(p);
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
