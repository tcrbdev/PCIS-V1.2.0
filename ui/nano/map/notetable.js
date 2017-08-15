import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Icon, Button, Table, Tooltip, Form, Input, Popover, Popconfirm, Checkbox, Modal } from 'antd';

import FontAwesome from 'react-fontawesome'

import moment from 'moment'

import {
    deleteMarkerNote,
    setMarkerNoteDefault
} from '../actions/nanomaster'

import styles from './index.scss'

const FormItem = Form.Item
const confirm = Modal.confirm
const { TextArea } = Input

class NoteTable extends Component {

    state = {
        modalSelectData: {
            NOTE: []
        }
    }

    componentWillReceiveProps(nextProps, nextState) {
        const { modalSelectData } = nextProps
        this.setState({ modalSelectData })
    }

    componentDidMount() {
        const { modalSelectData } = this.props
        this.setState({ modalSelectData })
    }

    confirmDeleteNote = (record, index) => {
        // console.log(record)
        this.props.deleteMarkerNote(record.SysNO)
    }

    editNote = (record, index) => {
        let { modalSelectData } = this.state
        modalSelectData.NOTE[index].editNote = !modalSelectData.NOTE[index].editNote;

        this.setState({ modalSelectData })
    }

    onOk = (record) => {
        console.log('OK');
    }

    onCancel = (record) => {
        console.log('cancel');
        this.setState({ defaultNoteValue: null })
    }

    setDefaultShowNote = (e, record, index) => {
        if (e.target.checked) {
            confirm({
                title: 'Do you want to set these item to default note ?',
                content: 'If OK this note has been set to default note for show in marker detail.',
                onOk: () => this.onOk(record),
                onCancel: () => this.onCancel(record)
            })
        }
    }

    onSaveEditNote = (record, index) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values[`EditText_${record.SysNO}`])
                let { modalSelectData } = this.state
                modalSelectData.NOTE[index].editNote = !modalSelectData.NOTE[index].editNote;

                this.setState({ modalSelectData })
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form

        const columns = [{
            key: 'SysNo',
            width: '4%',
            className: `${styles['align-left']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
            render: (text, record, index) => {
                return (
                    <Checkbox
                        checked={record.IsDefault}
                        onChange={(e) => this.setDefaultShowNote(e, record, index)} />
                )
            }
        }, {
            title: (<div className={styles['div-center']}><span></span></div>),
            width: '5%',
            className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
            render: (text, record, index) => {
                if (record.editNote) {
                    return (
                        <div className={styles['icon-edit-note-container']}>
                            <Popconfirm title="Cancel edit ?" okText="Yes" cancelText="No" onConfirm={() => this.editNote(record, index)}>
                                <Tooltip placement="right" title="Cancel">
                                    <Icon style={{ color: '#E91E63', marginBottom: '6px' }} type="close" />
                                </Tooltip>
                            </Popconfirm>
                            <Popconfirm title="Save note ?" okText="Yes" cancelText="No" onConfirm={() => this.onSaveEditNote(record, index)}>
                                <Tooltip placement="right" title="Save">
                                    <Icon style={{ color: '#2196F3', marginBottom: '6px' }} type="save" />
                                </Tooltip>
                            </Popconfirm>
                        </div>
                    )
                }
                else {
                    return (
                        <div className={styles['icon-edit-note-container']}>
                            <Tooltip placement="right" title="Edit">
                                <Icon style={{ color: '#2196F3', marginBottom: '6px' }} type="edit" onClick={() => this.editNote(record, index)} />
                            </Tooltip>
                            <Popconfirm title="Are you sure to delete this note ?" okText="Yes" cancelText="No" onConfirm={() => this.confirmDeleteNote(record, index)}>
                                <Tooltip placement="right" title="Delete">
                                    <FontAwesome style={{ color: '#E91E63' }} name="trash-o" />
                                </Tooltip>
                            </Popconfirm>
                        </div>
                    )
                }
            }
        }, {
            title: (<div className={styles['div-center']}><span>Note Detail</span></div>),
            dataIndex: 'Note',
            key: 'Note',
            width: '54%',
            className: `${styles['align-left']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
            render: (text, record, index) => {
                if (record.editNote) {
                    return (
                        <FormItem>
                            {
                                getFieldDecorator(`EditText_${record.SysNO}`, {
                                    initialValue: record.Note,
                                    rules: [
                                        { required: true, message: 'Please note something.' },
                                    ]
                                })(<TextArea placeholder="Note any detail" autosize={{ minRows: 2, maxRows: 3 }} />)
                            }
                        </FormItem>
                    )
                }
                else {
                    return text
                }
            }
        }, {
            title: (<div className={styles['div-center']}><span>Create By</span></div>),
            dataIndex: 'CreateBy',
            key: 'CreateBy',
            width: '13%',
            className: `${styles['align-left']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
        }, {
            title: (<div className={styles['div-center']}><span>Lastest</span></div>),
            dataIndex: 'CreateDate',
            key: 'CreateDate',
            width: '14%',
            className: `${styles['align-left']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
            render: (text, record, index) => {
                return (
                    <div className={styles['icon-edit-note-container']} style={{ fontSize: '11px' }}>
                        <span>{moment(text).format('DD/MM/YYYY')}</span>
                        <span>{moment(text).format('HH:mm:ss')}</span>
                    </div>
                )
            }
        }, {
            title: (<div className={styles['div-center']}><span>History</span></div>),
            width: '10%',
            className: `${styles['align-center']} ${styles['sm-padding']} ${styles['vertical-middle']}`,
            render: (text, record, index) => {
                return (
                    <div className={styles['icon-edit-note-container']}>
                        <Popover placement="topRight" content={'Hello World'} title={<div className={styles['modal-note-header']}><FontAwesome name="history" /><span>Update History</span></div>} trigger="click">
                            <Tooltip placement="left" title="Update History">
                                <FontAwesome name="history" />
                            </Tooltip>
                        </Popover>
                    </div>
                )
            }
        }]

        return (
            <Form onSubmit={this.onSaveEditNote}>
                <Table
                    bordered
                    className={styles['summary-table']}
                    pagination={false}
                    dataSource={this.state.modalSelectData.NOTE}
                    columns={columns}
                    locale={{
                        emptyText: 'No note.'
                    }} />
            </Form>
        )
    }
}

const formNoteTable = Form.create()(NoteTable)

export default connect((state) => { }, {
    deleteMarkerNote: deleteMarkerNote,
    setMarkerNoteDefault: setMarkerNoteDefault
})(formNoteTable)