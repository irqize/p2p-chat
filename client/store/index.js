import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './rootReducer';
import socketMiddleware from './socketMiddleware'
import notificationMiddleware from './notifications/notificationMiddleware'
import { composeWithDevTools } from 'redux-devtools-extension'

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(socketMiddleware(), notificationMiddleware))
);

export default store;