import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import "./styles.css";
import store from './store'

import App from './src/App'

ReactDOM.render((
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route path="/join">
                    <App isjoinlink={1} />
                </Route>
                <Route path="/">
                    <App isjoinlink={0} />
                </Route>
            </Switch>
        </BrowserRouter>
    </Provider>
), document.getElementById('app'));