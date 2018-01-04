import React, { Component } from 'react'
import { connect } from 'react-redux'

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd'

const boxSource = {
    beginDrag(props) {
        console.log("Drag ", props)
        return props
    }
}

const binTarget = {
    drop(props) {
        console.log("Drop", props)
    }
}

class Item extends Component {
    render() {
        const { connectDragSource } = this.props

        return connectDragSource(
            <div style={{ width: '100px', height: '20px', border: '1px solid', cursor: 'pointer' }}>
                Drag Item
            </div>
        )
    }
}

class Dustbin extends Component {
    render() {
        const { connectDropTarget, isOver, canDrop } = this.props
        console.log(this.props, isOver, canDrop)

        return connectDropTarget(
            <div style={{ width: '80px', height: '80px', border: '1px solid', background: `${isOver ? 'red' : '#EEE'}` }}>
                Drop Here
            </div>
        )
    }
}

const DragItem = DragSource(props => props.type, boxSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))(Item)

const DropDustbin = DropTarget('item', binTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
}))(Dustbin)


class Dnd extends Component {
    render() {
        return (
            <div style={{ width: '100%', height: '100%', border: '1px solid', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <span>Hello</span>
                {
                    [1, 2].map((item, index) => {
                        return <DragItem type="item" key={index} />
                    })
                }
                <DropDustbin />
            </div>
        )
    }
}

const ContextDnd = DragDropContext(HTML5Backend)(Dnd)

export default ContextDnd