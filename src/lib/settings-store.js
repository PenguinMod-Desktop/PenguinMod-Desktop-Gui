class Settings {
    /**
     * Creates a new cache
     * @param {String} fileName The name of the file used for settings
     * @param {Object} defaults The default settings
     */
    constructor(fileName, defaults) {
        this.file = fileName;
        this._data = defaults;

        this._attemptLoadData();
    }

    /**
     * Attempt to read from local storage
     * @private
     */
    _attemptLoadData() {
        const data = localStorage.getItem("pm:" + this.file + ".settings");
        if (data == null) {
            this._attemptSaveData();
            return;
        }

        this._data = JSON.parse(data);
    }

    /**
     * Attempt to save to local storage
     * @private
     */
    async _attemptSaveData() {
        localStorage.setItem("pm:" + this.file + ".settings", JSON.stringify(this._data));
    }

    /**
     * Adds data to the settings, or updates the data if it is already there.
     * @param {String} first The key to store the data at.
     * @param {String} second The data to store.
     */
    update(first, second) {
        this._data[first] = second;
        this._attemptSaveData();
    }

    /**
     * Gets data from the settings.
     * @param {String} first The key to get data from.
     * @returns 
     */
    get(first) {
        return this._data[first];
    }
}

module.exports = {
    DesktopSettings: new Settings('desktop', {
        livetests: false
    })
};
