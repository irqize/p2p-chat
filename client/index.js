import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import { ToastProvider } from 'react-toast-notifications'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import "./styles.css";
import store from './store'

import App from './src/App'

ReactDOM.render((
    <ToastProvider placement="top-right" autoDismiss="true" autoDismissTimeout={2000}>
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
    </ToastProvider>
), document.getElementById('app'));