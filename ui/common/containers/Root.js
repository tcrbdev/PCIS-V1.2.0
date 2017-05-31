import React, { Component } from 'react'
import { Provider } from 'react-redux'
import routes from '../routes'
import injectTapEventPlugin from 'react-tap-event-plugin';
import { LocaleProvider } from 'antd';

import enUS from 'antd/lib/locale-provider/en_US';

import configureStore from '../store/configureStore'
import { browserHistory } from 'react-router'

class App extends Component {

    componentWillMount() {
        injectTapEventPlugin()
    }

    render() {
        const store = configureStore(browserHistory)

        return (
            <Provider store={store} key='provider'>
                <LocaleProvider locale={enUS}>
                    {routes(store, browserHistory)}
                </LocaleProvider>
            </Provider>
        )
    }
}

export default App