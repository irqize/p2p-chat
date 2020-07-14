import actionTypes from './notificationActionTypes'
import { v4 } from 'uuid'
import { removeNotification } from './notificationsActions'
import { autoDismissTimeout } from './notificationsConfig'

const notificationMiddleware = ({ dispatch, getState }) => next => action => {
    switch (action.type) {
        case actionTypes.addNotification:
            const notification = {
                content: action.content,
                isError: action.isError,
                id: v4()
            }

            setTimeout(() => {
                dispatch(removeNotification(notification))
            }, autoDismissTimeout);

            action.notification = notification;

            return next(action);
        default:
            return next(action);
    }
}


export default notificationMiddleware;

