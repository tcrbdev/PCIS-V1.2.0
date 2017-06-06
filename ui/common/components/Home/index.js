import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Input, Button, DatePicker, Timeline, Modal, Spin, Table } from 'antd';
import { Card, Icon, Image } from 'semantic-ui-react'
import moment from 'moment'
import _ from 'lodash'

import { withCookies } from 'react-cookie';
import config from '../../../config'

import { getMasterAll } from '../../actions/master'
import { authenticate } from '../../actions/login'

class Home extends Component {

    state = {
        value: null,
        visible: false,
        loading: true,
        data: []
    }

    componentWillMount() {
        this.props.getMasterAll()
    }

    componentWillReceiveProps(nextProps) {
        const { MASTER_ALL } = nextProps

        this.setState({ loading: MASTER_ALL.load })

        if (!MASTER_ALL.load && _.isEmpty(this.state.data)) {
            this.setState({ loading: false, data: MASTER_ALL.province })
        }
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

    expandedRowRender(record) {
        console.log("Record : ", record)

        return (
            <Card>
                <Image src='http://172.17.9.94/pcisservices/StaffPicture/58385 Janewit.jpg' />
                <Card.Content>
                    <Card.Header>
                        {record.RegionCode}
                    </Card.Header>
                    <Card.Meta>
                        <span className='date'>
                            {record.ProvinceNameTH}
                        </span>
                    </Card.Meta>
                    <Card.Description>
                        {record.ProvinceNameEN}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <a>
                        <Icon name='user' />
                        22 Friends
                        </a>
                </Card.Content>
            </Card>
        )
    }

    gotoCustomerInfo() {
        this.props.router.push("/customer")
    }

    render() {
        const columns = [{
            title: 'Region Code',
            dataIndex: 'RegionCode',
            key: 'RegionCode',
        }, {
            title: 'Province Code',
            dataIndex: 'ProvinceCode',
            key: 'ProvinceCode',
        }, {
            title: 'Province Name TH',
            dataIndex: 'ProvinceNameTH',
            key: 'ProvinceNameTH',
        }];

        const signOut = () => {
            const { authenticate, cookies } = this.props
            cookies.remove(config.tokenName, { path: config.tokenPath })
            authenticate({
                name: 'Mariana',
                password: '1234'
            })
        }

        return (
            <Spin size="large" spinning={this.state.loading}>
                <Button type="primary" onClick={this.showModal}>Open WTF</Button>
                <Button type="primary" onClick={signOut}>Sign Out</Button>
                <Button type="primary" onClick={this.gotoCustomerInfo.bind(this)}>Go to Customer</Button>
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
                <Table dataSource={this.state.data} rowKey="SysNO" columns={columns} expandedRowRender={this.expandedRowRender} />
            </Spin>
        )
    }

}

const CookiesHomeForm = withCookies(Home)

export default connect(
    (state) => ({
        MASTER_ALL: state.MASTER_ALL
    }), {
        getMasterAll: getMasterAll,
        authenticate: authenticate
    })(CookiesHomeForm)