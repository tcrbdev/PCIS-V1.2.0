import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import { App, Home } from './components'


export default (store, history) => {
    return (
        <Router history={syncHistoryWithStore(history, store)}>
            <Route path='/' component={App}>
                <IndexRoute component={Home} />
            </Route>
            <Route path='/reactweb/' component={App}>
                <IndexRoute component={Home} />
            </Route>
        </Router>
    )
}
