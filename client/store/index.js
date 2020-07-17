import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './rootReducer';
import socketMiddleware from './socketMiddleware'
import notificationMiddleware from './notifications/notificationMiddleware'

const store = createStore(
    rootReducer,
    compose(applyMiddleware(socketMiddleware(), notificationMiddleware))
);

export default store;