import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import { App, Home } from './components'
import { Login, Auth, CustomerInfo, CustomerProfile } from './containers'

import { AppAssignmentContainer } from './containers/case_handle'

import { CookiesProvider } from 'react-cookie'


export default (store, history) => {
    return (
        <CookiesProvider>
            <Router history={syncHistoryWithStore(history, store)}>
                <Route path='/login' component={Login} />
                <Route path='/reactweb' component={Login} />
                <Route component={Auth} >
                    <Route path='/' component={App} >
                        <IndexRoute component={Home} />
                        <Route path='/customer(/:name)' component={CustomerProfile} />
                        <Route path='/home' component={Home} />
                        <Route path='/assignment' component={AppAssignmentContainer} />
                    </Route>
                </Route>
            </Router>
        </CookiesProvider>
    )
}
