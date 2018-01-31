import React, { Component } from 'react'
import { Provider } from 'react-redux'
import routes from '../routes'

import { App } from '../components'
import { CookiesProvider } from 'react-cookie'

import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import configureStore from '../store/configureStore'

class Root extends Component {

    render() {
        const { history } = this.props
        const store = configureStore(history)

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

            // <Provider store={store} key='provider'>
            //     <LocaleProvider locale={enUS}>
            //         {routes(store, history)}
            //     </LocaleProvider>
            // </Provider>
