import actionTypes from './controlsActionTypes'

export const changeMute = (to) => ({
    type: actionTypes.changeMute,
    to
});

export const changeSilent = (to) => ({
    type: actionTypes.changeSilent,
    to
});

export const changePopup = (to) => ({
    type: actionTypes.changePopup,
    to
});
