import 'react-hot-loader/patch'
import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Nano from './market'

const rootEl = document.getElementById('app')

render(
    <AppContainer>
        <Nano />
    </AppContainer>,
    rootEl
)

if (module.hot) {
    module.hot.accept('./market', () => {
        const NextRootApp = require('./market').default
        render(
            <AppContainer>
                <NextRootApp />
            </AppContainer>,
            rootEl);
    });
}