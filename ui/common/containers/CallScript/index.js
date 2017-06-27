import React, { Component } from 'react'

import { Icon, Upload, Button } from 'antd';

class CallScript extends Component {
    render() {
        const props = {
            action: 'http://TC001PCIS1P:60001/upload',
            onChange: this.handleChange,
            multiple: true,
        };
        return (
            <div>
                <span>CallScript</span>
                <Icon type="phone" style={{ fontSize: '25px', marginLeft: '10px', color: 'green' }} />
                <Upload {...props}>
                    <Button>
                        <Icon type="upload" />
                    </Button>
                </Upload>
            </div>
        )
    }
}

export default CallScript