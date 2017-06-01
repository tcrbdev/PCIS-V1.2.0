import React, { Component } from 'react'
import { connect } from 'react-redux'
import { authenticate } from '../../actions/login'
import { withCookies, Cookies } from 'react-cookie';
import md5 from 'md5'
import config from '../../../config'
import styles from './index.scss'

import { Form, Icon, Input, Button, Checkbox, Alert } from 'antd';
const FormItem = Form.Item;

class NormalLoginForm extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.authenticate({
                    name: values.name,
                    password: md5(values.password)
                })
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        const { AUTH, cookies } = nextProps

        console.log()

        if (AUTH)
            if (AUTH.success) {
                if (nextProps.form.getFieldValue('remember')) {
                    cookies.set(config.tokenName, AUTH.token, { path: config.tokenPath })
                }
                this.props.router.push("/index")
            }
    }

    textChange(e) {
        console.log(e.target.value)
    }

    errorMessage() {
        const { AUTH } = this.props;

        if (!AUTH.success && AUTH.message)
            return (<Alert message={AUTH.message} type="error" showIcon />)
    }

    render() {
        const { AUTH, form: { getFieldDecorator } } = this.props;

        return (
            <div className={styles['login-container']}>
                <div className={styles['login-profile']}>
                    <img src="http://172.17.9.94/pcisservices/StaffPicture/58385 Janewit.jpg" />
                </div>
                {this.errorMessage()}
                <Form onSubmit={this.handleSubmit} className={styles["login-form"]}>
                    <FormItem>
                        {getFieldDecorator('name', {
                            initialValue: 'Mariana',
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" onChange={this.textChange} />
                            )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            initialValue: 'password',
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
                            )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>Remember me</Checkbox>
                            )}
                        <a className="login-form-forgot" href="" style={{ float: 'right' }}>Forgot password</a>
                        <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
                            Log in
                    </Button>
                        Or <a href="">register now!</a>
                    </FormItem>
                </Form >
            </div>
        )
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

const CookiesLoginForm = withCookies(WrappedNormalLoginForm)

export default connect(
    (state) => ({ AUTH: state.AUTH }),
    {
        authenticate: authenticate
    })(CookiesLoginForm)
