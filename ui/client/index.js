import 'react-hot-loader/patch'
import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Root from '../common/containers/Root'

const rootEl = document.getElementById('app')

render(
    <AppContainer>
        <Root />
    </AppContainer>,
    rootEl
)

if (module.hot) {
    module.hot.accept('../common/containers/Root', () => {
        const NextRootApp = require('../common/containers/Root').default
        render(
            <AppContainer>
                <NextRootApp />
            </AppContainer>,
            rootEl);
    });
}