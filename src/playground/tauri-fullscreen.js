window.addEventListener('keydown', async (ev) => {
    if (ev.key === "F11") {
        const tauriWindow = window.__TAURI__.window.getCurrentWindow()

        const fullscreen = await tauriWindow.isFullscreen();
        await tauriWindow.setFullscreen(!fullscreen);
    }
})