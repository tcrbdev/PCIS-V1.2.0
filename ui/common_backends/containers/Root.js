import React, { Component } from 'react'
import { Provider } from 'react-redux'
import routes from '../routes'
import { LocaleProvider } from 'antd';

import enUS from 'antd/lib/locale-provider/en_US';

import configureStore from '../store/configureStore'
import { browserHistory } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'

class Root extends Component {

    render() {
        
        const history = createBrowserHistory()
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