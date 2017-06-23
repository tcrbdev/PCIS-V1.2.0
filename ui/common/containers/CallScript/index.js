import React, { Component } from 'react'

import { Icon } from 'antd';

class CallScript extends Component {
    render() {
        return (
            <div>
                <span>CallScript</span>
                <Icon type="phone" style={{ fontSize: '25px', marginLeft: '10px', color: 'green' }} />
            </div>
        )
    }
}

export default CallScript