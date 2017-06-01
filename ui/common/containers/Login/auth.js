import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie';
import config from '../../../config'

class Auth extends Component {

    componentWillMount() {
        this.checkAuth()
    }

    componentDidUpdate(prevProps) {
        this.checkAuth()
    }

    checkAuth() {
        const { AUTH, cookies } = this.props
        let authFailed = false

        if (!cookies.get(config.tokenName, { path: config.tokenPath })) {
            if (AUTH) {
                if (!AUTH.success) {
                    authFailed = true
                }
            }
            else {
                authFailed = true
            }
        }

        if (authFailed) {
            this.props.router.push("/login")
        }
    }

    render() {
        return this.props.children
    }
}

const CookiesAuthForm = withCookies(Auth)

export default connect(
    (state) => ({ AUTH: state.AUTH })
)(CookiesAuthForm)