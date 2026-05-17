const LOCAL_STORAGE_KEY = 'pm:desktop.settings';
const SET_LIVETESTS = 'desktop-settings/SET_LIVETESTS';

const data = localStorage.getItem(LOCAL_STORAGE_KEY);
const initialState = Object.assign({
    livetests: null
}, data === null ? {} : JSON.parse(data));

const _reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_LIVETESTS:
        return Object.assign({}, state, {
            livetests: action.livetests
        });
    default:
        return state;
    }
};

const reducer = function (state, action) {
    const ret = _reducer(state, action);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ret));
    return ret;
};

const setLivetests = livetests => ({
    type: SET_LIVETESTS,
    livetests: livetests
});

export {
    reducer as default,
    initialState as desktopSettingsInitialState,
    setLivetests
};
