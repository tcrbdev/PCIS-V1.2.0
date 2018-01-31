import React, { Component } from 'react'

import Scrollbar from 'react-smooth-scrollbar'
import { Avatar, Tooltip, Card, Divider } from 'antd'

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd'

import { findAll } from 'obj-traverse/lib/obj-traverse'

import styles from './index.scss'

// function new_script(src) {
//     return new Promise(function (resolve, reject) {
//         var script = document.createElement('script');
//         script.src = src;
//         script.addEventListener('load', function () {
//             resolve();
//         });
//         script.addEventListener('error', function (e) {
//             reject(e);
//         });
//         document.body.appendChild(script);
//     })
// };


const boxSource = {
    beginDrag(props) {
        return props
    }
}

const binTarget = {
    drop(props, monitor) {
        const { node } = props
        const source = monitor.getItem()

        props.onDrop(source.node, node)
    }
}


class DropItem extends Component {
    render() {
        const { connectDropTarget, isOver, canDrop, node, type, NodeComponent, sourceItem } = this.props

        return connectDropTarget(
            <div>
                <NodeComponent node={node} type={type} isOver={isOver} canDrop={canDrop} source={sourceItem} />
            </div>
        )
    }
}

class Item extends Component {
    render() {
        const { connectDragSource, node, type, NodeComponent, isDragging, onDrop, sourceItem } = this.props
        return connectDragSource(
            <div>
                <DropDustbin NodeComponent={NodeComponent} node={node} type={type} onDrop={onDrop} sourceItem={sourceItem} />
            </div>
        )
    }
}

const DragItem = DragSource(props => props.type, boxSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    sourceItem: monitor.getItem()
}))(Item)

const DropDustbin = DropTarget('node', binTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
}))(DropItem)

const OrgChart = ({ tree, NodeComponent, onDrop }) => {

    const renderChildren = (node) => {
        const style = { gridColumn: `1 / ${(node.children || [{}]).length + 1}`, margin: '0 10px' }

        return (
            <div style={{ gridColumn: '1 / span 2' }}>
                <div
                    className={styles['orgNodeParentGroup']}
                    style={{ gridTemplateColumns: `repeat(${(node.children || [{}]).length},auto)` }}>
                    <div
                        className={styles['orgNodeParentGroup-Header']}
                        style={{ ...style }}>
                        <div>
                            <DragItem type={'node'} NodeComponent={NodeComponent} node={node} onDrop={onDrop} />
                        </div>
                    </div>
                    {
                        //(node.coordinator || []).length == 0 &&
                        (node.children || []).length > 0 &&
                        <div
                            className={styles['orgNodeParentGroup-VerticalLine']}
                            style={{ ...style }}>
                            <div style={{ borderRight: `1px solid #2196f3` }}></div>
                            <div style={{ borderLeft: `1px solid #2196f3` }}></div>
                        </div>
                    }
                    {
                        /*(node.coordinator || []).length > 0 &&
                        (node.coordinator).map((nodeCo, nodeCoIndex) => {
                            let lineRight = { style: {} }

                            return (
                                <div
                                    className={styles['orgNodeParentGroup-Coordinator']}
                                    style={{ ...style }}>
                                    <div>
                                        <div style={lineRight.style}></div>
                                        <div style={lineRight.style}></div>
                                    </div>
                                    <div>
                                        <div style={{ borderTop: '2px dashed #2196f3', borderRight: '2px dashed #2196f3' , border }}></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div style={{ gridColumn: '1 / span 2', display: 'flex', justifyContent: 'center' }}>
                                            <NodeComponent node={nodeCo} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })*/
                    }
                    <div
                        className={styles['orgNodeParentGroup-HorizontalLine']}
                        style={{ ...style }}>
                        {
                            (node.children || []).map((child, childIndex) => (
                                <div style={{ gridColumn: `${(childIndex + 1)} / ${(childIndex + 2)}` }}>
                                    <div style={{ borderRight: `1px ${child.isCoordinator ? 'dotted' : 'solid'} #2196f3`, borderTop: `${childIndex > 0 ? `2px ${child.isCoordinator ? 'dotted' : 'solid'}  #2196f3` : '0'}` }}></div>
                                    <div style={{ borderLeft: `1px ${child.isCoordinator ? 'dotted' : 'solid'} #2196f3`, borderTop: `${childIndex != node.children.length - 1 ? `2px ${child.isCoordinator ? 'dotted' : 'solid'} #2196f3` : '0'}` }}></div>
                                </div>
                            ))
                        }
                        {
                            (node.children || []).map((child, childIndex) => (
                                <div style={{ gridColumn: `${(childIndex + 1)} / ${(childIndex + 2)}` }}>
                                    {
                                        renderChildren(child)
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    };

    return (
        <Scrollbar overscrollEffect="bounce" style={{ padding: '10px', width: '100%', height: '100%' }}>
            {renderChildren(tree)}
        </Scrollbar>
    )
};

class App extends Component {

    state = {
        initechOrg: {
            name: "Bill Lumbergh",
            actor: "Gary Cole",
            id: 1,
            children: [{
                name: "node 1",
                actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                isCoordinator: true,
            }, {
                name: "node 1",
                actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                children: [{
                    name: "node 1",
                    actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                    children: [{
                        name: "node 1",
                        actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                        isCoordinator: true,
                        children: [{
                            name: "node 1",
                            actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!"
                        }]
                    }]
                }, {
                    name: "node 5",
                    actor: "fffff",
                    isCoordinator: true
                }, {
                    name: "node 2",
                    actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                    children: [{
                        name: "node 1",
                        actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                    }, {
                        name: "node 2",
                        actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                    }, {
                        name: "node 2",
                        id: 2,
                        actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                    }, {
                        name: "node 2",
                        actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                        isCoordinator: true,
                    }, {
                        name: "node 2",
                        actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                    }, {
                        name: "node 2",
                        actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                    }, {
                        name: "node 2",
                        actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                    }, {
                        name: "node 2",
                        actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                    }, {
                        name: "node 2",
                        actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                    }, {
                        name: "node 2",
                        actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                    }, {
                        name: "node 2",
                        actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                        isCoordinator: true,
                    }]
                }]
            }, {
                name: "node 2",
                actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                children: [{
                    name: "node 1",
                    actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!"
                }, {
                    name: "node 2",
                    actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                }, {
                    name: "node 2",
                    actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                }, {
                    name: "node 2",
                    actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                }, {
                    name: "node 2",
                    actor: "This is just to show how to build a complex tree with multiple levels of children. Enjoy!",
                }]
            }]
        }
    }
    onDrop = (source, target) => {
        console.log(source, target, source === target)
        console.log(findAll(this.state.initechOrg, 'children', { isCoordinator: true }))

        let new_data = _.cloneDeep(this.state.initechOrg)


    }

    render() {

        const MyNodeComponent = ({ node, type, isOver, canDrop, source }) => {

            console.log("source", source)
            return (
                <Card
                    hoverable
                    onClick={() => console.log(node, type)}
                    style={{ width: '140px', border: isOver ? `1px dashed #2196f3` : '' }}
                >
                    {node.name}
                </Card>
            );
        };

        return (
            <div className="App" id="initechOrgChart" style={{ background: '#FFF', marginTop: '16px', height: '600px' }}>
                <OrgChart tree={this.state.initechOrg} NodeComponent={MyNodeComponent} onDrop={this.onDrop} />
            </div>
        );
    }
}

const AppDnd = DragDropContext(HTML5Backend)(App)

export default AppDnd