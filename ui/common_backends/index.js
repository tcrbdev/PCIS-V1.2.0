import React from 'react'
import { render } from 'react-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import 'react-hot-loader/patch'
import { AppContainer } from 'react-hot-loader'
import Root from './containers/Root'

const rootEl = document.getElementById('app')
const history = createBrowserHistory()

if (process.env.NODE_ENV === 'dev') {
    render(
        <AppContainer>
            <Root history={history} />
        </AppContainer>,
        rootEl
    )

    if (module.hot) {
        module.hot.accept('./containers/Root', () => {
            const NextRootApp = require('./containers/Root').default
            render(
                <AppContainer>
                    <NextRootApp history={history} />
                </AppContainer>,
                rootEl);
        });
    }
}
else {
    render(<Root />, rootEl)
}