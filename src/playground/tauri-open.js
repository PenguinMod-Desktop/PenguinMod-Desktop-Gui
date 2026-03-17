const openUrl = window.__TAURI__.opener.openUrl;

window.open = (url, target, features) => {
    openUrl(url);
};