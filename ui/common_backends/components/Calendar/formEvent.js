import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Layout, Icon, Button, Modal, Form, Input, Tooltip, Checkbox, DatePicker, TimePicker, Row, Col, Popconfirm } from 'antd'
import FontAwesome from 'react-fontawesome'
import moment from 'moment'

import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox'

import styles from './index.scss'

const FormItem = Form.Item
const { TextArea } = Input
const RangePicker = DatePicker.RangePicker

class CalendarFormEvent extends Component {

    state = {
        googlePlace: null,
        locationDetail: null,
    }

    handleSubmit = (e) => {
        e.preventDefault()

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                const event = this.props.formItem

                const DBEvent = {
                    E_Id: event.E_Id,
                    E_EmployeeCode: '58385',
                    E_Type_Code: event.E_Type_Code,
                    E_Title: event.title,
                    E_Description: values.description,
                    E_Location: values.location,
                    E_Latitude: this.state.locationDetail.geometry.location.lat(),
                    E_Longitude: this.state.locationDetail.geometry.location.lng(),
                    E_Start: values.allday ? values.date[0].utc().format("YYYY-MM-DD") : `${moment(values.date[0].utc()).format("YYYY-MM-DD")} ${values.timestart.format("HH:mm")}`,
                    E_End: values.allday ? values.date[1].utc().format("YYYY-MM-DD 00:01:00") : `${moment(values.date[0].utc()).format("YYYY-MM-DD")} ${values.timeend.format("HH:mm")}`,
                    E_IsAllDay: values.allday ? 'Y' : 'N',
                    E_InviteStatus: null,
                    E_InviteBy: null,
                    E_CreateBy: '58385',
                    E_InviteCC: null,
                    title: `${event.E_Group_Title} ${event.E_Type_Description}`,
                    foreColor: event.E_Group_ForeColor,
                    backgroundColor: event.E_Group_BackgroundColor,
                }

                console.log(DBEvent)

                this.props.onOk(DBEvent)
            }
        })
    }

    onPlacesChanged = () => {

        const { setFieldsValue } = this.props.form
        const { googlePlace } = this.state

        if (googlePlace.getPlaces().length > 0) {
            console.log(googlePlace.getPlaces()[0])
            this.setState({ locationDetail: googlePlace.getPlaces()[0] })
            setFieldsValue({ location: googlePlace.getPlaces()[0].formatted_address })
        }
    }

    onCancel = () => {
        this.props.form.resetFields()
        this.props.onCancel()
    }

    onOk = (e) => {
        this.handleSubmit(e)
    }

    confirmDeleteEvent = () => {
        console.log("delete event")
    }

    render() {

        const formItemLayout = {
            className: styles['form-label'],
            colon: false,
            labelCol: {
                sm: { span: 7 },
            },
            wrapperCol: {
                sm: { span: 17 },
            },
        }

        const {
            formItem,
            onCancel,
            onOk,
            form: {
                getFieldDecorator,
                getFieldValue
            }
        } = this.props

        console.log("------------------- formevent", formItem.start, formItem.end, formItem)

        const format = 'HH:mm'
        const start_date = moment(formItem.start)// moment(moment(formItem.E_Start).utc().format("YYYY-MM-DD HH:mm"))
        const end_date = moment(formItem.end)//moment(moment(formItem.E_End).utc().format("YYYY-MM-DD HH:mm"))

        return (
            <div>
                <Modal
                    visible={formItem ? true : false}
                    closable={false}
                    wrapClassName={styles['calendar-form-event']}
                    getContainer={() => document.getElementById("mask-modal-calendar-event")}
                    maskClosable={false}
                    mask={true}
                    maskTransitionName="fade"
                    footer={
                        <div style={{ display: 'flex', alignItems: 'center', margin: '0 -10px' }}>
                            {
                                formItem.type == 'event' &&
                                <div style={{ flex: '1', textAlign: 'left' }}>
                                    <Popconfirm
                                        title="Are you sure delete this event?"
                                        onConfirm={this.confirmDeleteEvent}>
                                        <Tooltip title="Delete Event">
                                            <Button shape="circle" type="danger" icon="delete" ghost disabled={false} />
                                        </Tooltip>
                                    </Popconfirm>
                                </div>
                            }
                            <div style={{ width: '100%', textAlign: 'right' }}>
                                <Tooltip title={`${formItem.type == 'event' ? 'Update' : 'Create'} Event`}>
                                    <Button shape="circle" icon={formItem.type == 'event' ? "edit" : 'save'} type="primary" loading={false} onClick={this.onOk} />
                                </Tooltip>
                            </div>
                        </div>
                    }
                    bodyStyle={{
                        padding: '0'
                    }}
                >
                    <div>
                        {
                            formItem &&
                            <div className={styles['calendar-from-event-header']} style={{ background: `${formItem.backgroundColor}`, color: `${formItem.foreColor}` }}>
                                <Icon type="tag" />
                                <Tooltip title={`${formItem.title}`}><span>{`${formItem.title}`}</span></Tooltip>
                                <Icon onClick={onCancel} type="close" className="close" />
                            </div>
                        }
                        <div className={styles['calendar-from-event-body']}>
                            <Form onSubmit={this.handleSubmit}>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span><FontAwesome name="align-left" /> Description</span>}
                                >
                                    {
                                        getFieldDecorator('description', {
                                            initialValue: formItem.description,
                                            rules: [
                                                { required: true, message: 'Please input description' },
                                            ]
                                        })
                                            (
                                            <TextArea size="small" autosize={{ minRows: 3, maxRows: 4 }} />
                                            )
                                    }
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span><FontAwesome name="map-marker" /> Location</span>}>
                                    {
                                        getFieldDecorator('location', {
                                            initialValue: formItem.E_Location,
                                            rules: [
                                                { required: true, message: 'Please input location' },
                                            ]
                                        })
                                            (
                                            <StandaloneSearchBox
                                                ref={ref => this.setState({ googlePlace: ref })}
                                                onPlacesChanged={this.onPlacesChanged}>
                                                <Input placeholder="Type your location" onChange={(e) => console.log(e, this)} />
                                            </StandaloneSearchBox>
                                            )
                                    }
                                </FormItem>
                                {
                                    this.state.locationDetail &&
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span><Icon type="global" /> Detail</span>}>
                                        <Row>
                                            <Col span={24} style={{ textAlign: 'right' }}>
                                                {
                                                    `${this.state.locationDetail.geometry.location.lat()} , ${this.state.locationDetail.geometry.location.lng()} `
                                                }
                                            </Col>
                                        </Row>
                                    </FormItem>
                                }
                                <FormItem
                                    {...formItemLayout}
                                    label={<span><FontAwesome name="calendar-check-o" /> Date</span>}
                                >
                                    <Row gutter={8}>
                                        <Col span={18}>
                                            {
                                                getFieldDecorator('date', {
                                                    initialValue: [start_date, end_date],
                                                    rules: [
                                                        { required: true, message: 'Please select date' },
                                                    ]
                                                })
                                                    (
                                                    <RangePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
                                                    )
                                            }
                                        </Col>
                                        <Col span={6}>
                                            {
                                                getFieldDecorator('allday', {
                                                    valuePropName: 'checked',
                                                    initialValue: formItem.allday
                                                })
                                                    (
                                                    <Checkbox className={styles['form-check-box']}><span style={{ fontSize: '11px', color: 'rgba(0,0,0,.6)' }}>All Day</span></Checkbox>
                                                    )
                                            }
                                        </Col>
                                    </Row>
                                </FormItem>
                                {
                                    !getFieldValue("allday") &&
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span><FontAwesome name="clock-o" /> Time</span>}
                                    >
                                        <Col span={11}>
                                            {
                                                getFieldDecorator('timestart', {
                                                    initialValue: start_date,
                                                    rules: [
                                                        { required: !getFieldValue("allday"), message: 'Please select start time' },
                                                    ]
                                                })
                                                    (
                                                    <TimePicker format={format} style={{ width: '100%' }} />
                                                    )
                                            }
                                        </Col>
                                        <Col span={2}>
                                            <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>-</span>
                                        </Col>
                                        <Col span={11}>
                                            {
                                                getFieldDecorator('timeend', {
                                                    initialValue: end_date,
                                                    rules: [
                                                        { required: !getFieldValue("allday"), message: 'Please select end time' },
                                                    ]
                                                })
                                                    (
                                                    <TimePicker format={format} style={{ width: '100%' }} />
                                                    )
                                            }
                                        </Col>
                                    </FormItem>
                                }
                            </Form>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

const WrappedCalendarFormEvent = Form.create()(CalendarFormEvent);

export default connect(
    (state) => ({
    }),
    {
    })(WrappedCalendarFormEvent)