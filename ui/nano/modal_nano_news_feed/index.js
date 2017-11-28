import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Layout, Icon, Button, Table, Tooltip, Modal, Form, Row, Col, Popover, Badge } from 'antd';
import Draggable from 'react-draggable'

const { Header } = Layout

import _ from 'lodash'
import FontAwesome from 'react-fontawesome'

import NewsFeed from '../nano_visit_popup/news_feed'

import styles from './index.scss'

class ModalNanoNewsFeed extends Component {
    state = {
        modalOpen: false,
    }

    handleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen })
    }

    handleCancel = () => {
        this.setState({ modalOpen: !this.state.modalOpen })
    }

    componentDidMount() {

        if (document.getElementById('modal-nano-news-feed') === null || document.getElementById('modal-nano-news-feed') === undefined) {
            var divModal = document.createElement("div")
            divModal.id = 'modal-nano-news-feed'
            document.getElementById('nano-news-feed').appendChild(divModal)
        }
    }

    render() {
        return (
            <div style={{ marginLeft: '0px' }}>
                <Modal
                    wrapClassName={`${styles['modalParentNanoNewFeed']}`}
                    className={styles['modalNanoNewsFeed']}
                    visible={this.state.modalOpen}
                    onCancel={this.handleCancel}
                    footer={null}
                    closable={false}
                    maskClosable={false}
                    mask={false}
                    getContainer={() => document.getElementById('modal-nano-news-feed')}>
                    <article className={styles['wrapper']}>
                        <NewsFeed
                            custom_width="610px"
                            ON_CLOSE_MARKER={this.handleCancel} />
                    </article>
                </Modal>

                <Tooltip title="News Feed" ><Badge count={0} style={{ backgroundColor: '#F44336' }}><FontAwesome style={{ color: '#009688', fontSize: '18px' }} name="rss" onClick={this.handleModal} /></Badge></Tooltip>
            </div>
        )
    }
}

export default connect(
    (state) => ({
    }),
    {
    })(ModalNanoNewsFeed)