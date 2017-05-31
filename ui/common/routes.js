import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import { App, Home, CustomerInfo } from './components'
import { Login } from './containers'

import { CookiesProvider } from 'react-cookie'

export default (store, history) => {
    return (
        <CookiesProvider>
            <Router history={syncHistoryWithStore(history, store)}>
                <Route path='/login' component={Login}>
                </Route>
                <Route path='/index' component={App}>
                    <IndexRoute component={Home} />
                    <Route path='customer' component={CustomerInfo}>
                    </Route>
                </Route>
            </Router>
        </CookiesProvider>
    )
}
