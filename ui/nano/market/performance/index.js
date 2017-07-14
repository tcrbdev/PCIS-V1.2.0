import React, { Component } from 'react'
import Scrollbar from 'react-smooth-scrollbar';
import { Icon, Button, Row, Col, Collapse, Input, Select } from 'antd';

import SummaryTable from '../summarytable'

import styles from './index.scss'

const Panel = Collapse.Panel

export default class Performance extends Component {
    render() {
        return (
            <div>
                <div>
                    <SummaryTable data={this.props.data} showSelect={true} showHeader={false} />
                </div>
                <Collapse defaultActiveKey="1">
                    <Panel
                        key="1"
                        header={<div className={styles['panel-header']}><Icon type="area-chart" />Performance Summary</div>}
                    >
                        <div style={{ height: '200px', display: 'flex', flex: '1' }}>
                            <Scrollbar overscrollEffect="bounce" style={{ height: '100%' }}>
                                <SummaryTable data={this.props.data} showSelect={true} />
                            </Scrollbar>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        )
    }
}
