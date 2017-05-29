import React, { Component } from 'react'
import moment from 'moment'
import { Input, Button, DatePicker, Timeline, Modal } from 'antd';

class Home extends Component {

    state = {
        value: null,
        visible: false
    }

    handleChange(value) {
        this.setState({ value })
    }

    onChange(e) {
        console.log(e)
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    render() {
        return (
            <div>
                <Button type="primary">Primary</Button>
                <Button type="primary" onClick={this.showModal}>Open WTF</Button>
                <DatePicker />
                <Modal
                    title="Basic Modal"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}>
                    
                    <Input placeholder="Basic usage" onChange={e => this.handleChange(e.target.value)} />
                    <Timeline>
                        <Timeline.Item>{this.state.value}</Timeline.Item>
                        <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                        <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
                    </Timeline>
                </Modal>
            </div>
        )
    }

}

export default Home