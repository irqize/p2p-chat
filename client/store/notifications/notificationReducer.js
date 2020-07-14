import actionTypes from './notificationActionTypes'

const initalState = {
    notifications: []
}


export default function (state = initalState, action) {
    const newState = {}
    newState.notifications = [...state.notifications];
    switch (action.type) {
        case actionTypes.addNotification:
            newState.notifications.push(action.notification);
            return newState;
        case actionTypes.removeNotification:
            newState.notifications = newState.notifications.filter(notification => notification !== action.notification);
            return newState;
        default:
            return state;
    }

}