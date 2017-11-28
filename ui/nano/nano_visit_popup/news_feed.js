import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Layout, Icon, Tooltip, Popover, Card, Timeline, Table } from 'antd';

import FontAwesome from 'react-fontawesome'
import moment from 'moment'

import styles from './index.scss'


class NewsFeed extends Component {

    getHeaderTitle = (props) => {
        const { item, ON_CLOSE_MARKER, custom_width } = props

        return (
            <div className={styles['headers']} style={{ background: '#009688' }}>
                <FontAwesome className="trigger" name='rss' />
                <span>News Feed</span>
                <Icon
                    onClick={() => ON_CLOSE_MARKER()}
                    className="trigger"
                    type='close' />
            </div>
        )

    }

    render() {
        const { item, ON_CLOSE_MARKER, custom_width, NANO_VISIT_POPUP_INFO, NO_HEADER } = this.props

        if (!_.isEmpty(NANO_VISIT_POPUP_INFO)) {
            return (
                <Layout style={{ width: custom_width ? custom_width : '610px', overflow: 'hidden', background: '#FFF' }}>
                    {
                        !NO_HEADER &&
                        this.getHeaderTitle(this.props)
                    }
                    <Layout style={{ backgroundColor: '#FFF', margin: '10px 10px 5px 10px', backgroundColor: '#FFF' }}>
                        <div style={{ marginLeft: '-5px', marginRight: '-5px', backgroundColor: '#FFF' }}>
                            <span>News Feed</span>
                        </div>
                    </Layout>
                </Layout >
            )
        }
        else {
            return null
        }
    }
}

export default connect(
    (state) => ({
        NANO_VISIT_POPUP_INFO: state.NANO_VISIT_POPUP_INFO
    }), {
    })(NewsFeed)