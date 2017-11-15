import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie';
import Draggable from 'react-draggable'

import { Icon, Button, Collapse, Layout, Table, Tooltip, Popover, Menu, Dropdown } from 'antd';
import Scrollbar from 'react-smooth-scrollbar';

import SummaryTable from '../summarytable'
import Filter from '../filter'
import GMap from '../map'
import BranchSummary from '../branch_summary'
import FontAwesome from 'react-fontawesome'

import moment from 'moment'

import {
    getNanoMasterData,
    searchNanoData
} from '../actions/nanomaster'

import { constantQueryType } from '../../common/constants/constants'
import styles from './index.scss'

const { Header, Sider, Content } = Layout
const Panel = Collapse.Panel

const dataTotalSummary = [{
    kpi: "Target"
}, {
    kpi: "Actual"
}, {
    kpi: "%Ach."
}, {
    kpi: "Unit"
}]

class Index extends Component {

    state = {
        collapsed: false,
        SEARCH_BRANCH_MARKER: [],
        collapsedSummary: false,
        openFilterCollapsed: "1"
    }

    componentWillMount() {
        this.initData();

        // Set Title
        $('title').text('Nano OK Menu')
    }

    initData() {
        const { getNanoMasterData, cookies } = this.props
        if (process.env.NODE_ENV === 'production') {
            console.log("Cookie : ", cookies.get('authen_info'))
            if (!_.isEmpty(cookies.get('authen_info'))) {
                const auth = cookies.get('authen_info')
                getNanoMasterData(auth);
            }
            else {
                window.location.href = 'http://tc001pcis1p/login/'
            }
        }
        else {
            getNanoMasterData();
        }
    }

    handlePanel = () => {
        this.setState({ collapsed: !this.state.collapsed })
    }

    renderInitData() {
        return (
            <div className={styles['loading-container']}>
                <FontAwesome name="circle-o-notch" size='5x' spin />
                <span className={styles['loading-text']}>Loading...</span>
            </div>
        )
    }

    getViewMap() {
        if (this.props.ON_NANO_SEARCHING_DATA) {
            return (
                <div className={styles['loading-container']}>
                    <FontAwesome name="circle-o-notch" size='5x' spin />
                    <span className={styles['loading-text']}>Loading...</span>
                </div>
            )
        }
        else {
            return (
                <div className={styles['map-container']}>
                    <GMap
                        containerElement={<div style={{ height: `100%` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                    />
                    <div className={styles['float-button']}>
                        <Button
                            shape="circle"
                            icon="arrow-right"
                            className={this.state.collapsed && styles['rotate']}
                            onClick={this.handlePanel} />
                    </div>
                </div>
            )
        }
    }

    getViewItem() {
        if (this.props.ON_NANO_SEARCHING_DATA) {
            return (
                <div className={styles['loading-container']}>
                    <FontAwesome name="circle-o-notch" size='5x' spin />
                    <span className={styles['loading-text']}>Loading...</span>
                </div>
            )
        }
        else {
            return (
                <div className='info-container'>
                    <BranchSummary hiddenPanel={this.state.collapsed} />
                    <Scrollbar overscrollEffect="bounce" style={{ padding: '10px' }}>
                        {
                            <SummaryTable />
                        }
                    </Scrollbar>
                </div>
            )
        }
    }

    in_array = (needle, haystack, argStrict) => {
        var key = '', strict = !!argStrict;
        if (strict) {
            for (key in haystack) {
                if (haystack[key] === needle) {
                    return true
                }
            }
        } else {
            for (key in haystack) {
                if (haystack[key] == needle) {
                    return true
                }
            }
        }

        return false

    }

    handleLayer(e) {
        $(`.${styles['top-layer']}`).removeClass(styles['top-layer'])
    }

    handleDrag(e) {
    }

    renderForm() {
        const side_menu = this.state.collapsed ? styles['side-menu-close'] : styles['side-menu']

        const Coordinates = document.getElementById('app').getBoundingClientRect()
        return (
            <Layout style={{ overflow: 'hidden' }}>
                <Layout>
                    <Content className={styles['map-container']}>
                        {
                            this.getViewMap()
                        }
                    </Content>
                </Layout>
                <Sider
                    className={side_menu}
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}>

                    <Filter
                        searchHandle={this.searchHandle}
                    />
                    {
                        this.getViewItem()
                    }

                </Sider>
                <Draggable onDrag={this.handleDrag} defaultClassNameDragged={styles['top-layer']} onMouseDown={this.handleLayer} defaultPosition={{ x: (Coordinates.width / 2) - 350, y: (Coordinates.height / 2) - 270 }}>
                    <div id="add-sale" className={styles['multiple-window']}></div>
                </Draggable>
                <Draggable onDrag={this.handleDrag} defaultClassNameDragged={styles['top-layer']} onMouseDown={this.handleLayer} defaultPosition={{ x: (Coordinates.width / 2) - 350, y: (Coordinates.height / 2) - 270 }}>
                    <div id="add-area" className={styles['multiple-window']}></div>
                </Draggable>
                <Draggable onDrag={this.handleDrag} defaultClassNameDragged={styles['top-layer']} onMouseDown={this.handleLayer}>
                    <div id="direction-info" className={styles['multiple-window']}></div>
                </Draggable>
                <Draggable onDrag={this.handleDrag} defaultClassNameDragged={styles['top-layer']} onMouseDown={this.handleLayer} defaultPosition={{ x: (Coordinates.width / 2) - 350, y: (Coordinates.height / 2) - 270 }}>
                    <div id="add-portfolio-chart" className={styles['multiple-window']}></div>
                </Draggable>
                <Draggable onDrag={this.handleDrag} defaultClassNameDragged={styles['top-layer']} onMouseDown={this.handleLayer} defaultPosition={{ x: (Coordinates.width / 2) - 350, y: (Coordinates.height / 2) - 270 }}>
                    <div id="add-portfolio-chart2" className={styles['multiple-window']}></div>
                </Draggable>
                <Draggable onDrag={this.handleDrag} defaultClassNameDragged={styles['top-layer']} onMouseDown={this.handleLayer} defaultPosition={{ x: (Coordinates.width / 2) - 350, y: (Coordinates.height / 2) - 270 }}>
                    <div id="add-sale-summary-chart" className={styles['multiple-window']}></div>
                </Draggable>
                <Draggable onDrag={this.handleDrag} defaultClassNameDragged={styles['top-layer']} onMouseDown={this.handleLayer} defaultPosition={{ x: (Coordinates.width / 2) - 350, y: (Coordinates.height / 2) - 270 }}>
                    <div id="add-sale-summary-chart2" className={styles['multiple-window']}></div>
                </Draggable>
            </Layout>
        )
    }

    render() {
        return (
            <div className={styles['container']}>
                {
                    this.props.NANO_INIT_PAGE ? this.renderInitData() : this.renderForm()
                }
            </div>
        )
    }
}

const CookiesHomeForm = withCookies(Index)

export default connect(
    (state) => ({
        NANO_INIT_PAGE: state.NANO_INIT_PAGE,
        ON_NANO_SEARCHING_DATA: state.ON_NANO_SEARCHING_DATA
    }),
    {
        getNanoMasterData: getNanoMasterData
    })(CookiesHomeForm)