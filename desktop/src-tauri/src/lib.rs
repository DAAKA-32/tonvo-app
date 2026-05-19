use tauri::Manager;
#[cfg(desktop)]
use tauri_plugin_updater::UpdaterExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default();

    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_focus();
                let _ = window.unminimize();
            }
        }));
    }

    builder
        .plugin(tauri_plugin_deep_link::init())
        .setup(|app| {
            #[cfg(desktop)]
            {
                app.handle()
                    .plugin(tauri_plugin_updater::Builder::new().build())?;

                // Silent background auto-update. On each launch we ask the
                // tonvo.co manifest if a newer signed release exists; if so we
                // download and install it in the background. The new version
                // is applied on the next app restart — no dialog, no prompt,
                // no manual download. Errors (offline, server hiccup) are
                // swallowed so they never block the user.
                let handle = app.handle().clone();
                tauri::async_runtime::spawn(async move {
                    if let Ok(updater) = handle.updater() {
                        if let Ok(Some(update)) = updater.check().await {
                            let _ = update
                                .download_and_install(|_, _| {}, || {})
                                .await;
                        }
                    }
                });
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Tonvo Desktop");
}
