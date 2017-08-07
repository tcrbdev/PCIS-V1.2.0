import React, { Component } from 'react'
import { Provider } from 'react-redux'
import injectTapEventPlugin from 'react-tap-event-plugin';

import configureStore from './store/configureStore'

import { CookiesProvider } from 'react-cookie'

import enUS from 'antd/lib/locale-provider/en_US';
import { LocaleProvider } from 'antd';

import App from './app'

class Root extends Component {

    componentWillMount() {
        injectTapEventPlugin()
    }

    render() {
        return (
            <Provider store={configureStore()} key='provider'>
                <CookiesProvider>
                    <LocaleProvider locale={enUS}>
                        <App />
                    </LocaleProvider>
                </CookiesProvider>
            </Provider>
        )
    }
}

export default Root