import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie';
import Draggable from 'react-draggable'

import { Button, Collapse, Layout, Tooltip, Icon } from 'antd';
import Scrollbar from 'react-smooth-scrollbar';

import SummaryTable from '../summarytable'
import Filter from '../filter'
import GMap from '../map'
import BranchSummary from '../branch_summary'
import FontAwesome from 'react-fontawesome'

// import HOCScript from './HOCScript'
// import ModalCaDirectionMarket from '../modal_ca_direction_market'

import moment from 'moment'

import {
    getNanoMasterData,
    searchNanoData,
    getNanoVisitPopupInformation
} from '../actions/nanomaster'

import VisitPopup from './visit-popup'
// import ModalNanoStopApproval from '../modal_nano_stop_approval'
// import ModalNanoNewsFeed from '../modal_nano_news_feed'

// import { constantQueryType } from '../../common/constants/constants'
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
        openFilterCollapsed: "1",
        role: "0"
    }

    componentWillMount() {
        this.initData();

        // Set Title
        // $('title').text('Nano OK Menu')
    }

    initData() {
        const { getNanoMasterData, getNanoVisitPopupInformation, cookies } = this.props
        if (process.env.NODE_ENV === 'production') {
            console.log("Cookie : ", cookies.get('authen_info'))
            if (!_.isEmpty(cookies.get('authen_info'))) {
                const auth = cookies.get('authen_info')
                getNanoMasterData(auth.Auth);
                // getNanoVisitPopupInformation({ EmpCode: auth.Auth.EmployeeCode });
                this.setState({ role: auth.Auth.EmployeeCode })
            }
            else {
                window.location.href = 'http://tc001pcis1p/login/'
                // window.location.href = 'http://tc001pcis1u/login/'
            }
        }
        else {
            getNanoMasterData({ EmployeeCode: '58385' });
            // getNanoVisitPopupInformation({});
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
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAz3d9Z7MLoDq4IdCz4g9ji0hGNl2Dg14U&v=3.exp&libraries=geometry,drawing,places&sensor=true&language=th"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `100%` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                    />

                    {/* <div style={{ width: '100%', height: '100%' }}>
                        <div style={{ width: '100%', height: '100%' }}>
                            <Icon type="exclamation-circle" style={{ marginBottom: '15px', fontSize: '35px', color: '#F44336' }} />
                            <span>Have trouble loading Google Map please try again later.</span>
                            <span>Or press F5 on keyboard for refresh this's page.</span>
                            <span style={{ marginTop: '15px', fontSize: '14px', color: '#009688' }} >(But search data is ready to use.)</span>
                            <span style={{ marginTop: '15px', fontSize: '16px', color: '#F44336' }} >We are sorry for inconvenience.</span>
                        </div>
                    </div> */}
                    <div className={styles['float-button']}>
                        <Button
                            shape="circle"
                            icon="arrow-right"
                            className={`${this.state.collapsed ? styles['rotate'] : ''}`}
                            onClick={this.handlePanel} />
                    </div>
                </div >
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

        const AuthList = ['57251', '58385', '56225', '58141', '56679', '58106', '59016', '57568', '59440', '57160', '57249', '59151', '58202', '57170', '59613', '56367', '59184']

        return (
            <Layout style={{ overflow: 'hidden' }}>
                {
                    <VisitPopup role={this.state.role} />
                }
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
                    <div className={styles['icon-header-container']} style={{ zIndex: '4', right: '23%' }}>
                        <div className={`${this.state.collapsed && styles['hide']}`} style={{ opacity: this.state.collapsed ? 0 : 1, height: '100%' }}>
                            {/*
                                !_.isEmpty(_.find(AuthList, o => o == this.props.AUTH_NANO_USER.EmployeeCode)) &&
                                <a target="_blank" href="http://tc001pcis1p/nanolayout/">
                                    <div className={styles['ca-icon-lists']} style={{ height: '100%', paddingTop: '5px' }}>
                                        <Tooltip title="Nano Layout" >
                                            <span style={{ position: 'relative' }}>
                                                <FontAwesome name="braille " style={{ fontSize: '18px', paddingTop: '4px', color: '#64a717' }} />
                                            </span>
                                        </Tooltip>
                                    </div>
                                </a>
                            */}
                            <a target="_blank" href="http://tc001pcis1p/nanolayout/">
                                <div className={styles['ca-icon-lists']} style={{ height: '100%', paddingTop: '5px' }}>
                                    <Tooltip title="Nano Layout" >
                                        <span style={{ position: 'relative' }}>
                                            <FontAwesome name="braille " style={{ fontSize: '18px', paddingTop: '4px', color: '#64a717' }} />
                                        </span>
                                    </Tooltip>
                                </div>
                            </a>
                            <a target="_blank" href="http://tc001pcis1p/calendar/">
                                <div className={styles['ca-icon-lists']} style={{ height: '100%', paddingTop: '5px', marginLeft: '5px' }}>
                                    <Tooltip title="calendar" >
                                        <span style={{ position: 'relative' }}>
                                            <FontAwesome name="calendar-o" style={{ fontSize: '18px', paddingLeft: '1px' }} />
                                            <i style={{ position: 'absolute', left: '54%', transform: 'translate(-50%, 0)', paddingTop: '3px', fontSize: '8px' }}>{moment(new Date()).format("DD")}</i>
                                        </span>
                                    </Tooltip>
                                </div>
                            </a>
                            {/* <div className={styles['ca-icon-lists']} style={{ height: '100%', paddingTop: '5px' }}>
                                <ModalNanoStopApproval />
                            </div> */}
                            {/* <div className={styles['ca-icon-lists']} style={{ height: '100%', paddingTop: '5px' }}>
                                <ModalNanoNewsFeed />
                            </div> */}
                        </div>
                    </div>
                    <Filter
                        searchHandle={this.searchHandle}
                    />
                    {
                        this.getViewItem()
                    }

                </Sider>

                <Draggable handle=".ModalHeader" bounds="parent" onDrag={this.handleDrag} defaultClassNameDragged={styles['top-layer']} onMouseDown={this.handleLayer} defaultPosition={{ x: (Coordinates.width / 2) - 350, y: (Coordinates.height / 2) - 270 }}>
                    <div className={styles['multiple-window']} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="ModalHeader" style={{ width: '100%', height: '35px', right: '60px', position: 'absolute', zIndex: '1001', background: 'transparent' }}></div>
                        <div id="add-sale" ></div>
                    </div>
                </Draggable>

                <Draggable handle=".ModalHeader" bounds="parent" onDrag={this.handleDrag} defaultClassNameDragged={styles['top-layer']} onMouseDown={this.handleLayer} defaultPosition={{ x: (Coordinates.width / 2) - 350, y: (Coordinates.height / 2) - 270 }}>
                    <div className={styles['multiple-window']} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="ModalHeader" style={{ width: '100%', height: '35px', right: '60px', position: 'absolute', zIndex: '1001', background: 'transparent' }}></div>
                        <div id="add-area" ></div>
                    </div>
                </Draggable>

                <Draggable handle=".ModalHeader" bounds="parent" onDrag={this.handleDrag} defaultClassNameDragged={styles['top-layer']} onMouseDown={this.handleLayer}>
                    <div className={styles['multiple-window']} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="ModalHeader" style={{ width: '100%', height: '35px', right: '60px', position: 'absolute', zIndex: '1001', background: 'transparent' }}></div>
                        <div id="direction-info" ></div>
                    </div>
                </Draggable>

                <Draggable handle=".ModalHeader" bounds="parent" onDrag={this.handleDrag} defaultClassNameDragged={styles['top-layer']} onMouseDown={this.handleLayer}>
                    <div className={styles['multiple-window']} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="ModalHeader" style={{ width: '100%', height: '35px', right: '60px', position: 'absolute', zIndex: '1001', background: 'transparent' }}></div>
                        <div id="add-portfolio-chart" ></div>
                    </div>
                </Draggable>

                <Draggable handle=".ModalHeader" bounds="parent" onDrag={this.handleDrag} defaultClassNameDragged={styles['top-layer']} onMouseDown={this.handleLayer}>
                    <div className={styles['multiple-window']} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="ModalHeader" style={{ width: '100%', height: '35px', right: '60px', position: 'absolute', zIndex: '1001', background: 'transparent' }}></div>
                        <div id="add-portfolio-chart2" ></div>
                    </div>
                </Draggable>

                <Draggable handle=".ModalHeader" bounds="parent" onDrag={this.handleDrag} defaultClassNameDragged={styles['top-layer']} onMouseDown={this.handleLayer}>
                    <div className={styles['multiple-window']} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="ModalHeader" style={{ width: '100%', height: '35px', right: '60px', position: 'absolute', zIndex: '1001', background: 'transparent' }}></div>
                        <div id="add-sale-summary-chart" ></div>
                    </div>
                </Draggable>

                <Draggable handle=".ModalHeader" bounds="parent" onDrag={this.handleDrag} defaultClassNameDragged={styles['top-layer']} onMouseDown={this.handleLayer}>
                    <div className={styles['multiple-window']} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="ModalHeader" style={{ width: '100%', height: '35px', right: '60px', position: 'absolute', zIndex: '1001', background: 'transparent' }}></div>
                        <div id="add-sale-summary-chart2" ></div>
                    </div>
                </Draggable>

                <Draggable handle=".ModalHeader" bounds="parent" onDrag={this.handleDrag} defaultClassNameDragged={styles['top-layer']} onMouseDown={this.handleLayer}>
                    <div className={styles['multiple-window']} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="ModalHeader" style={{ width: '100%', height: '35px', right: '60px', position: 'absolute', zIndex: '1001', background: 'transparent' }}></div>
                        <div id="nano-stop-approval" ></div>
                    </div>
                </Draggable>

                <Draggable handle=".ModalHeader" bounds="parent" onDrag={this.handleDrag} defaultClassNameDragged={styles['top-layer']} onMouseDown={this.handleLayer}>
                    <div className={styles['multiple-window']} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="ModalHeader" style={{ width: '100%', height: '35px', right: '60px', position: 'absolute', zIndex: '1001', background: 'transparent' }}></div>
                        <div id="nano-news-feed" ></div>
                    </div>
                </Draggable>

                <Draggable onDrag={this.handleDrag} defaultClassNameDragged={styles['top-layer']} onMouseDown={this.handleLayer}>
                    <div className={styles['multiple-window']} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="ModalHeader" style={{ width: 'calc(100% - 130px)', height: '35px', left: '40px', right: '85px', position: 'absolute', zIndex: '1001' }}></div>
                        <div className="ModalHeader" id="ca-directino-market" style={{ position: 'relative' }} ></div>
                        <div className="ModalHeader" style={{ width: '100%', height: '10px', left: '0px', right: '85px', cursor: 'pointer', bottom: '0px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'absolute', zIndex: '1001' }}>
                            <Icon type="caret-up" style={{ transform: 'rotate(-135deg)' }} />
                            <Icon type="caret-down" style={{ transform: 'rotate(-45deg)' }} />
                        </div>
                    </div>
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
        ON_NANO_SEARCHING_DATA: state.ON_NANO_SEARCHING_DATA,
        AUTH_NANO_USER: state.AUTH_NANO_USER,
    }),
    {
        getNanoMasterData: getNanoMasterData,
        getNanoVisitPopupInformation: getNanoVisitPopupInformation
    })(CookiesHomeForm)