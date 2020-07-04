import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import "./styles.css";
import store from './store'

import App from './src/App'
import Lobby from './src/lobby'

ReactDOM.render((
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route path="/join/:lobbyId">
                    <Lobby />
                </Route>
                <Route path="/">
                    <App />
                </Route>
            </Switch>
        </BrowserRouter>
    </Provider>
), document.getElementById('app'));