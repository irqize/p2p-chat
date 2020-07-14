import actionTypes from './notificationActionTypes'

export const addNotification = (content, isError = false) => ({
    type: actionTypes.addNotification,
    content,
    isError
});

export const removeNotification = (notification) => ({
    type: actionTypes.removeNotification,
    notification
});