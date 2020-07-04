import { createStore, applyMiddleware } from 'redux'
import rootReducer from './rootReducer';
import socketMiddleware from './socketMiddleware'
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(socketMiddleware()))
);

export default store;