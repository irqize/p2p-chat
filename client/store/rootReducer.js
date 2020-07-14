import appReducer from './appReducer'
import notificationReducer from './notifications/notificationReducer'

import { combineReducers } from 'redux'

export default combineReducers({
    main: appReducer,
    notifications: notificationReducer
});