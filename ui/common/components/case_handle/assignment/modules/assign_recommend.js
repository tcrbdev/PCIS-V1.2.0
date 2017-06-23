import React, { Component } from 'react'
import { Form, Input, Button, Table, Progress, Row, Col } from 'antd'
import Style from '../style/assign_component.css'

const FormItem = Form.Item
const InputGroup = Input.Group
const ButtonGroup = Button.Group

class AssignmentRecommendContent extends Component {

    render() {

        const columns = [
            {
                title: '#',
                dataIndex: 'runno',
                key: 'runno',
                className: 'text_upper text-center',
                width: 45
            },
            {
                title: 'Employee',
                dataIndex: 'employee',
                key: 'employee',
                className: 'text_upper text-center',
                width: 180
            },
            {
                title: (<span>Onhand</span>),
                dataIndex: 'case_onhand',
                key: 'case_onhand',
                className: 'text_upper text-center',
                width: 70
            },
            {
                title: '% Success',
                dataIndex: 'success_per',
                key: 'success_per',
                className: 'text_upper text-center',
                width: 200
            },
            {
                title: '% Success (Overall)',
                dataIndex: 'overviewsucc_per',
                key: 'overviewsucc_per',
                className: 'text_upper text-center',
                width: 200
            }
        ]

        const dataSource = [
            {
                key: '1',
                runno: '1',
                employee: 'บุปผชาติ กตัญญู',
                case_onhand: 32,                
                success_per: (<Progress percent={81} status="active" />),
                overviewsucc_per: (<Progress percent={62} status="active"  />)
            },
            {
                key: '2',
                runno: '2',
                employee: 'วไลพร อาการส',
                case_onhand: 27,
                success_per: (<Progress percent={55} status="active" />),
                 overviewsucc_per: (<Progress percent={73} status="active" />)
            },
            {
                key: '3',
                runno: '3',
                employee: 'ชยพล ชุมหล่อ',
                case_onhand: 25,
                success_per: (<Progress percent={48} status="active" />),
                 overviewsucc_per: (<Progress percent={54} status="active" />)
            }
        ]

        const { getFieldDecorator } = this.props.form;

        return (
            <article>
                <h4 className="text_upper hide">Assignment Form</h4>
                <section>
                    <h4 className="bg_darkCyan fg_white pad5 text_upper">Decision Recommend for Assignment</h4>
                    <Row type="flex" justify="start">
                        <Col span={24}>
                            <Table rowKey="uid" columns={columns} dataSource={dataSource} pagination={false} size="middle" bordered />
                            <span className="fg_amber" style={{ fontSize: '0.9em' }}>หมายเหตุ: % Succ คิดจากเปอร์เซ็นต์ความสำเร็จของเคสจาก Campaign</span>
                        </Col>
                    </Row>
                </section>
                <section className="marg_top10">            
                    <h4 className="bg_teal fg_white pad5 text_upper">Application Assignment</h4>
                    <Form className="pad_tb10">
                        <Row type="flex" justify="start">
                            <Col span={24}>
                                <label className="text_upper bold">Application Owner</label>
                                <InputGroup compact>
                                    <FormItem className="lineHeight_none text_upper bold inline" style={{ width: '15%' }}>
                                        {
                                            getFieldDecorator('app_ownercode', {
                                                rules: [{
                                                    type: 'text',
                                                    message: ''
                                                },
                                                {
                                                    required: false,
                                                    message: ''
                                                }]
                                            })(<Input placeholder="Emp Code" />)
                                        }
                                    </FormItem>
                                    <FormItem className="lineHeight_none text_upper bold inline" style={{ width: '30%' }}>
                                        {
                                            getFieldDecorator('app_ownername', {
                                                rules: [{
                                                    type: 'text',
                                                    message: ''
                                                },
                                                {
                                                    required: false,
                                                    message: ''
                                                }]
                                            })(<Input placeholder="Emp Name" />)
                                        }
                                    </FormItem>
                                    <FormItem className="lineHeight_none bold inline pad_left5" style={{ width: '17%' }}>                                     
                                         <Button id="assign_commit" type="primary" icon="login" htmlType="submit" size="large" className="text_upper" style={{}}>Assign</Button>                 
                                    </FormItem> 
                                    <FormItem className="lineHeight_none bold inline" style={{ width: '15%' }}>
                                        <Button shape="circle" icon="clock-circle-o" />               
                                    </FormItem>      
                                </InputGroup>
                            </Col>
                        </Row>
                    </Form>

                </section>

            </article>
        )
    }

}

export default Form.create()(AssignmentRecommendContent)
