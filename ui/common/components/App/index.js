import React, { Component } from 'react'
import { instanceOf } from 'prop-types';
import { connect } from 'react-redux'
import Scrollbar from 'react-smooth-scrollbar';
import { withCookies, Cookies } from 'react-cookie';
// import _ from 'lodash'

import styles from './index.scss'

class App extends Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    state = {
        unlisten: null
    }


    routerListen(route) {
        // console.log("Listen ---------------------------------------------- : ", route, this)
        // this.checkAuth(this.props, this.state)
        // console.log(this.props.AUTH.data.success)
    }

    componentWillMount() {
        const { cookies } = this.props
        console.info(this.props, cookies.get('token'))
        // if (!this.state.unlisten)
        //     this.setState({ unlisten: this.props.router.listen(this.routerListen.bind(this)) })

        // this.checkAuth(this.props)
    }

    componentWillReceiveProps(nextProps) {
        // this.checkAuth(nextProps, this.state)
    }

    componentWillUnmount() {
        // console.log("component will unmount")
        // console.log(this.state)
        this.state.unlisten()
    }

    checkAuth(props, state) {
        const { AUTH } = props
        let authFailed = false

        if (AUTH.data) {
            if (!AUTH.data.success) {
                authFailed = true
            }
        }
        else {
            authFailed = true
        }

        if (authFailed) {
            if (!_.isEmpty(state)) {
                if (typeof state.unlisten === 'function')
                    state.unlisten()
            }
            // this.props.router.push("/login")
        }
    }

    render() {
        return (
            <div className={styles['app-container']}>
                <header className={styles['header']}></header>
                <div className={styles['body-container']}>
                    <Scrollbar style={{ height: '100%' }} overscrollEffect={true}>
                        {this.props.children}
                    </Scrollbar>
                </div>
            </div>
        )
    }

}

const CookiesAppForm = withCookies(App)

export default connect(
    (state) => ({
        AUTH: state.AUTH
    }), {})(CookiesAppForm)
