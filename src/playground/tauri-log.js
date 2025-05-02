function forwardConsole(fnName, otherFnName) {
    const original = console[fnName];
    console[fnName] = (...message) => {
        original(...message);
        window.__TAURI__.log[otherFnName](message.reduce((t, c) => t + ' ' + c.toString(), ''));
    };
}

forwardConsole("log", "info");
forwardConsole("info", "info");
forwardConsole("trace", "trace");
forwardConsole("debug", "debug");
forwardConsole("warn", "warn");
forwardConsole("error", "error");
