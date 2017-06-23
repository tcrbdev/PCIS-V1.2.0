import React, { Component } from 'react'
import { Timeline, Icon } from 'antd';
import Style from './timeline-custom.css'

class TimelineLogger extends Component {

    render() {
         return (
            <article id="timeline_info_component">
                <header><h4 className="text_upper marg_bottom20">Application Activity</h4></header>
                <Timeline>
                    <Timeline.Item dot={<Icon type="check" style={{ fontSize: '16px' }} />} color="green">Create new record on 13/06/2017 10:30</Timeline.Item>
                    <Timeline.Item dot={<Icon type="check" style={{ fontSize: '16px' }} />} color="green" className="ant-timeline-item-opposit">Assign owner case on 13/06/2017 11:30</Timeline.Item>
                    <Timeline.Item dot={<Icon type="check" style={{ fontSize: '16px' }} />} color="green">Owner case is xxxxx</Timeline.Item>
                    <Timeline.Item className="ant-timeline-item-opposit" color="red">Case inprogress update...</Timeline.Item>
                </Timeline>
            </article>
        )
    }

}

export default TimelineLogger