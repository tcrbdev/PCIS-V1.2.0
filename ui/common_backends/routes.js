import React from 'react'
import { Router, Route } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import { App, Home } from './components'

import { CookiesProvider } from 'react-cookie'

const generateRouteComponent = components => {
    return (
        components.map(item => {
            if (item.childComponent) {
                return (
                    <div style={{ height: '100%' }}>
                        <Route key={item.componentId} path={item.componentPath} component={item.component} />
                        {
                            generateRouteComponent(item.childComponent)
                        }
                    </div>
                )
            }
            else {
                return (<Route key={item.componentId} path={item.componentPath} component={item.component} />)
            }
        })
    )
}

const getApplication = ({ match }) => {

    const path = `${match.url}`

    const component_route = [{
        componentId: '1',
        componentPath: `${path}`,
        component: App
    }]

    // return generateRouteComponent(component_route)
    return <Route key={1} path='/' component={App} />
}

export default (store, history) => {
    return (
        <CookiesProvider>
            <Router history={syncHistoryWithStore(history, store)}>
                <div style={{ height: '100%' }}>
                    <Route exact path='/' component={getApplication} />

                </div>
            </Router>
        </CookiesProvider>
    )
}
