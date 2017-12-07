import React from 'react'
import { render } from 'react-dom'
import Root from './containers/Root'
import 'react-hot-loader/patch'
import { AppContainer } from 'react-hot-loader'

const rootEl = document.getElementById('app')

if (process.env.NODE_ENV === 'dev') {
    render(
        <AppContainer>
            <Root />
        </AppContainer>,
        rootEl
    )

    if (module.hot) {
        module.hot.accept('./containers/Root', () => {
            const NextRootApp = require('./containers/Root').default
            render(
                <AppContainer>
                    <NextRootApp />
                </AppContainer>,
                rootEl);
        });
    }
}
else {
    render(<Root />, rootEl)
}