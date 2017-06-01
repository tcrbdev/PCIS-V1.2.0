import React, { Component } from 'react'
import { Form, Input, Button } from 'antd';
import _ from 'lodash'

const FormItem = Form.Item;

class CustomerInfo extends Component {
    render() {
        return (
            <div>
                <span>this's my another page child.</span>
                <div>
                </div>
            </div>
        )
    }
}

export default Form.create()(CustomerInfo)