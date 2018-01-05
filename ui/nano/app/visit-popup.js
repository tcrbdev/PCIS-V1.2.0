import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Modal, Tabs, Icon, Badge } from 'antd';

import FontAwesome from 'react-fontawesome'
import moment from 'moment'

import StopApproval from '../nano_visit_popup/stop_approval'
import NewsFeed from '../nano_visit_popup/news_feed'

import styles from './index.scss'

const TabPane = Tabs.TabPane;

class VisitPopup extends Component {
    state = {
        visible: false
    }

    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {

        const { NANO_VISIT_POPUP_STATUS } = this.props

        if (NANO_VISIT_POPUP_STATUS) {
            this.setState({
                visible: false,
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const { NANO_VISIT_POPUP_INFO, role } = nextProps

        if (!_.isEmpty(NANO_VISIT_POPUP_INFO))
            if (NANO_VISIT_POPUP_INFO[0].length > 0 && role == '6') {
                this.setState({
                    visible: true,
                });
            }
    }

    render() {
        const { NANO_VISIT_POPUP_INFO } = this.props

        return (
            <Modal
                visible={this.state.visible}
                onCancel={this.handleCancel}
                footer={null}
                className={styles['visit-modal']}
                maskClosable={false}
            >
                <Tabs defaultActiveKey="1">
                    <TabPane tab={
                        <div>
                            <Badge count={!_.isEmpty(NANO_VISIT_POPUP_INFO) ? NANO_VISIT_POPUP_INFO[1].length : 0} style={{ backgroundColor: '#F44336' }}>
                                <FontAwesome style={{ color: '#FF9800', fontSize: '18px' }} name="exclamation-triangle" />
                            </Badge>
                            <span style={{ marginLeft: '10px' }}>{`Warning Stop Approval (Plan < 5%)`}</span>
                        </div>
                    } key="1">
                        <StopApproval custom_width="610px" NO_HEADER={true} />
                    </TabPane>
                    {/* <TabPane tab={
                        <span>
                            <Badge count={0} style={{ backgroundColor: '#F44336' }}>
                                <FontAwesome style={{ color: '#009688', fontSize: '18px' }} name="rss" />
                            </Badge>
                            <span style={{ marginLeft: '10px' }}>News Feed</span>
                        </span>
                    } key="2">
                        <NewsFeed custom_width="610px" NO_HEADER={true} />
                    </TabPane> */}
                </Tabs>
            </Modal>
        )

    }
}

export default connect(
    (state) => ({
        NANO_VISIT_POPUP_INFO: state.NANO_VISIT_POPUP_INFO,
        NANO_VISIT_POPUP_STATUS: state.NANO_VISIT_POPUP_STATUS
    }), {
    })(VisitPopup)