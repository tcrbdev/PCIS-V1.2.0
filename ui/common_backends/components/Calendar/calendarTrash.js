import React, { Component } from 'react'
import { DropTarget } from 'react-dnd'

import { Tooltip } from 'antd'
import FontAwesome from 'react-fontawesome'

import styles from './index.scss'

class CalendarBin extends Component {
    render() {
        const { isOver, canDrop, connectDropTarget } = this.props

        return connectDropTarget(
            <span className={` ${isOver && canDrop ? styles['hover-trash'] : ''}`}>
                <Tooltip title="Move event to here for delete">
                    <FontAwesome name="trash-o" />
                </Tooltip>
            </span>
        )
    }
}

const binTarget = {
    drop(props, monitor) {
        props.onDrop(monitor.getItem())
    }
}

export default DropTarget('event', binTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
}))(CalendarBin)