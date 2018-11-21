import React, { Component } from 'react'
import { connect } from 'react-redux'
import { render, unmountComponentAtNode } from 'react-dom'
import styles from './index.scss'
import { Icon } from 'antd'

import { setGlobalPopoverState } from '../actions/nanomaster'

class CustomPopOver extends Component {

    constructor(props) {
        super(props);

        this.state = {
            key: this.props.key || Math.random(),
            onShow: false
        }
    }


    componentDidMount() {
        // const { trigger } = this.props
        // if ((trigger || '').toLowerCase() == 'click') {
        // this.refs.ContainerPopover.addEventListener('click', () => this.setStateOver(!this.state.onShow));
        // document.addEventListener('click', () => this.setStateOver(!this.state.onShow));
        // }

        this.addChildComponentToElement();
    }

    componentWillUnmount() {
        // console.log("unmount")
        // const { trigger } = this.props
        // if ((trigger || '').toLowerCase() == 'click') {
        // this.refs.ContainerPopover.removeEventListener('click');
        // document.removeEventListener('click', () => this.setStateOver(false));
        // }
    }

    componentDidUpdate() {
        this.addChildComponentToElement();
    }

    addChildComponentToElement = () => {
        const el = document.getElementById("popover-content");
        const elLayer = document.getElementById("layer-popover");
        const { GLOBAL_POPOVER_STATE } = this.props;

        if (el) {
            if (this.state.onShow) {
                if (GLOBAL_POPOVER_STATE.IsOpen) {

                    if (elLayer) {
                        unmountComponentAtNode(elLayer);
                        render(
                            <div className={styles['custom-popover']}>{
                                this.props.content
                            }
                            </div>, elLayer);
                    }
                    else {
                        var divModal = document.createElement("div")
                        divModal.id = 'layer-popover'
                        divModal.className = `${styles['on-top-hover']}`
                        el.appendChild(divModal)

                        render(
                            <div className={styles['custom-popover']}>{
                                this.props.content
                            }
                            </div>, document.getElementById("layer-popover"));
                    }
                }
                else {
                    render(
                        <div className={styles['custom-popover']}>{
                            this.props.content
                        }
                        </div>, el);
                }
            }
            else if (GLOBAL_POPOVER_STATE.Key == this.state.key && GLOBAL_POPOVER_STATE.IsOpen) {
                render(
                    <div className={`${styles['transparent-popover']}`}>
                        <div className={styles['custom-popover-header']}>
                            <div>
                                {
                                    this.props.title
                                }
                            </div>
                            <div>
                                <Icon onClick={() => this.setStateOver(false)} type="close" />
                            </div>
                        </div>
                        <div className="custom-popover-body">
                            {
                                this.props.content
                            }
                        </div>
                    </div>, el);
            }
            else if (!GLOBAL_POPOVER_STATE.IsOpen) {
                unmountComponentAtNode(el);
            }
            else {
                if (elLayer) {
                    unmountComponentAtNode(elLayer)
                }
            }
        }
    }

    setStateOver = (value) => {
        const { trigger, GLOBAL_POPOVER_STATE } = this.props

        if ((trigger || '').toLowerCase() == 'click') {
            if (GLOBAL_POPOVER_STATE.Key != this.state.key && GLOBAL_POPOVER_STATE.IsOpen) {
                this.props.setGlobalPopoverState(this.state.key, true);
            }
            else {
                this.props.setGlobalPopoverState(this.state.key, value);
            }
        }
        else {
            this.setState({ onShow: value });
        }
    }

    extractProperties = () => {
        const { trigger } = this.props
        let props = {
            ref: "ContainerPopover",
            key: this.state.key
        };

        switch ((trigger || '').toLowerCase()) {
            case 'click':
                props = {
                    onClick: () => this.setStateOver(!this.props.GLOBAL_POPOVER_STATE.IsOpen)
                }
                break;
            case 'hover':
            default:
                props = {
                    onMouseEnter: () => this.setStateOver(true),
                    onMouseLeave: () => this.setStateOver(false)
                }
                break;
        }

        return props;
    }

    render() {
        const { trigger, GLOBAL_POPOVER_STATE } = this.props

        const customProps = this.extractProperties();
        let activeStyle = {}

        if ((trigger || '').toLowerCase() == 'click') {
            if (GLOBAL_POPOVER_STATE.Key == this.state.key && GLOBAL_POPOVER_STATE.IsOpen) {
                activeStyle.backgroundColor = '#F44336';
            }
        }

        return (
            <div
                style={{ ...activeStyle }}
                ref={"ContainerPopover"}
                key={this.state.key}
                {...customProps}>
                {
                    this.props.children
                }
            </div>
        )
    }
}

export default connect((state) => (
    {
        GLOBAL_POPOVER_STATE: state.GLOBAL_POPOVER_STATE,
    }), {
        setGlobalPopoverState: setGlobalPopoverState
    })(CustomPopOver)