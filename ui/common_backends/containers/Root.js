import React, { Component } from 'react'
import { Provider } from 'react-redux'
import routes from '../routes'

import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import configureStore from '../store/configureStore'

class Root extends Component {

    render() {
        const { history } = this.props
        const store = configureStore(history)

        return (
            <Provider store={store} key='provider'>
                <LocaleProvider locale={enUS}>
                    {routes(store, history)}
                </LocaleProvider>
            </Provider>
        )
    }
}

export default Root