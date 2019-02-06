import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    Layout,
    Icon,
    Tooltip,
    Modal,
    Popover,
    Skeleton,
    Table,
    Switch,
    Badge
} from 'antd';
import FontAwesome from 'react-fontawesome'

import {
    PieChart,
    Pie,
    Cell,
    Tooltip as Tooltips,
    Label
} from 'recharts'

import styles from '../map/index.scss'
import styless from './index.scss'

import { withGoogleMap, GoogleMap, Marker, Polyline, OverlayView, Circle } from "react-google-maps";

import moment from 'moment'
import _ from 'lodash'

import CaDirectionProfile from './caDirectionProfiles'

import { getNanoBranchDirection } from '../actions/nanomaster'

import icon_full_branch from '../../../image/icon_full_branch.png'
import icon_Keyos from '../../../image/icon_Keyos.png'
import icon_Nano from '../../../image/icon_Nano.png'
import icon_Plan_Branch_Nano from '../../../image/i_Nano.png'

import { distanceBetweenPoints } from '../map/index'

const getPixelPositionOffset = (width, height) => ({
    x: -(width / 2),
    y: -(height / 2)
})

const CoordinateDistanceMiles = (Latitude1, Longitude1, Latitude2, Longitude2) => {
    if (Latitude1 == Latitude2 && Longitude1 == Longitude2) {
        return 0;
    } else {
        // -- CONSTANTS
        const EarthRadiusInMiles = 3963.1;
        const PI = Math.PI;
        const Kilometers = 1.609344;

        // -- RADIANS conversion
        const lat1Radians = Latitude1 * PI / 180;
        const long1Radians = Longitude1 * PI / 180;
        const lat2Radians = Latitude2 * PI / 180;
        const long2Radians = Longitude2 * PI / 180;

        return (Math.acos(Math.cos(lat1Radians) * Math.cos(long1Radians) * Math.cos(lat2Radians) * Math.cos(long2Radians) + Math.cos(lat1Radians) * Math.sin(long1Radians) * Math.cos(lat2Radians) * Math.sin(long2Radians) + Math.sin(lat1Radians) * Math.sin(lat2Radians)) * EarthRadiusInMiles) * Kilometers;
    }
}

const CustomLabel = props => {
    const { viewBox: { cx, cy }, value } = props

    return (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
            <tspan alignmentBaseline="middle" fontSize="14">{`${parseFloat(value).toFixed(0)}%`}</tspan>
        </text>
    );
}

class AssignmentTooltip extends Component {
    render() {
        const { active, payload } = this.props
        if (active) {
            const { payload, label, coordinate } = this.props
            return (
                <div key={`${label}_${coordinate.x}_${coordinate.y}`} className={styless['custom-tooltip']}>
                    <span>{payload[0].name}</span>
                    <span>{payload[0].value} Acc.</span>
                </div>
            )
        }
        else {
            return <div></div>
        }
    }
}

class DragRadius extends Component {
    state = {
        const_radius: 15000,
        defalt_lng: null,
        default_radius: 15000,
        ref_circle: null,
        on_drag: false,
        drag_location: null
    }

    onDrag = (e) => {
        const radius = distanceBetweenPoints(this.state.ref_circle.getCenter(), e.latLng) * 1000

        this.setState({ default_radius: radius, on_drag: true, drag_location: e.latLng })
    }

    onDragEnd = (e) => {
        const radius = distanceBetweenPoints(this.state.ref_circle.getCenter(), e.latLng) * 1000

        this.setState({ default_radius: radius, on_drag: false, drag_location: e.latLng })
    }

    restoreToDefault = () => {
        this.setState({ default_radius: this.state.const_radius, on_drag: false })
    }

    componentDidMount() {
        if (!_.isEmpty(this.refs.circle))
            this.setState({ ref_circle: this.refs.circle, defalt_lng: parseFloat(this.refs.circle.getBounds().getNorthEast().lng()) })
    }

    render() {
        const { item, index } = this.props
        let icon = icon_Plan_Branch_Nano

        let bgColor = 'rgba(0, 153, 255, 0.63)'
        switch (item.BranchType) {
            case "K":
                bgColor = 'rgba(255, 101, 0, 0.6)'
                break;
        }

        return (
            <div>
                {
                    <Circle
                        center={{ lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude) }}
                        radius={this.state.default_radius}
                        ref='circle'
                        options={{
                            strokeColor: this.state.on_drag ? '#656565' : '#F33A00',
                            strokeOpacity: 1,
                            strokeWeight: 2,
                            fillColor: '#656565',
                            fillOpacity: this.state.on_drag ? 0.1 : 0
                        }}>
                    </Circle>
                }
                {
                    this.refs.circle &&
                    <Marker
                        draggable={true}
                        onDrag={this.onDrag}
                        icon={{
                            url: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png",
                            size: new google.maps.Size(7, 7),
                            anchor: new google.maps.Point(4, 4)
                        }}
                        title='Resize'
                        position={{
                            lat: this.state.on_drag ? parseFloat(this.state.drag_location.lat()) : parseFloat(item.Latitude),
                            lng: this.state.on_drag ? parseFloat(this.state.drag_location.lng()) : this.state.defalt_lng
                        }}
                        key={`C_${index}`}
                    />
                }
                {
                    this.state.on_drag &&
                    <OverlayView
                        position={{
                            lat: this.state.on_drag ? parseFloat(this.state.drag_location.lat()) : parseFloat(item.BranchLatitude),
                            lng: this.state.on_drag ? parseFloat(this.state.drag_location.lng()) : this.state.defalt_lng
                        }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        getPixelPositionOffset={getPixelPositionOffset}>
                        <div className={styles['radius-info']} style={{ color: '#5f5f5f' }} >
                            <span>{parseFloat(this.state.default_radius / 1000).toFixed(1)}Km.
                                <Tooltip title="Reset">
                                    <FontAwesome name="refresh" style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={this.restoreToDefault} />
                                </Tooltip>
                            </span>
                        </div>
                    </OverlayView>
                }
            </div>
        )
    }
}

class GMapPath extends Component {

    componentDidMount() {
        // if (this.props.paths.length > 0) {
        // this.fitBounds(this.props.paths);
        // }
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.paths.length > 0) {
        // this.fitBounds(nextProps.paths);
        // }
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.paths.length != this.props.paths.length
    }

    fitBounds = (paths) => {
        const { fitBounds } = this.props

        if (fitBounds) {
            let bounds = new window
                .google
                .maps
                .LatLngBounds();

            paths.map((itemPath, index) => {
                const line = itemPath.paths.map(path => bounds.extend(new google.maps.LatLng(path.item.Latitude, path.item.Longitude)));
            });

            const { data, selectedItem } = this.props;

            // const kioskBranch = _.filter(data[0], { No: 1, BranchType: 'K' });
            const kioskBranch = _.filter(data[0], { No: 1 });

            // if (selectedItem.BranchCode.length <= 3 && kioskBranch.length > 0) {
            kioskBranch.map((kiosk, index) => bounds.extend(new google.maps.LatLng(kiosk.Latitude, kiosk.Longitude)));
            // }

            this.refs.map.fitBounds(bounds);
        }
    }

    getPolyLine = () => {
        const { paths } = this.props
        return paths.map((itemPath, index) => {
            const lines = _.filter(itemPath.paths.map(path => ({ lat: path.item.Latitude, lng: path.item.Longitude })), o => o.lat != null)
            return (<Polyline
                key={`PolyLine_${index}`}
                path={
                    lines
                }
                options={{
                    strokeColor: itemPath.strokeColor,
                    strokeWeight: 3
                }} />
            )
        });
    }

    getRadiusCircle = () => {
        const circle = [{
            radius: 5000,
            options: {
                strokeColor: '#08B21F',
                strokeOpacity: 1,
                strokeWeight: 2,
                fillColor: '#08B21F',
                fillOpacity: 0.04
            }
        }, {
            radius: 10000,
            options: {
                strokeColor: '#F3CA04',
                strokeOpacity: 1,
                strokeWeight: 2,
                fillColor: '#F3CA04',
                fillOpacity: 0.04
            }
        }, {
            radius: 15000,
            options: {
                strokeColor: '#F33A00',
                strokeOpacity: 1,
                strokeWeight: 2,
                fillColor: '#F33A00',
                fillOpacity: 0.04
            }
        }]

        const { data, selectedItem } = this.props;

        const Branch = _.find(data[0], o => o.BranchType != 'K' && o.No == 1);

        const radius = circle.map(c => (
            <Circle
                center={{ lat: parseFloat(Branch.Latitude), lng: parseFloat(Branch.Longitude) }}
                radius={c.radius}
                options={{ ...c.options }}
            />
        ))

        return radius;
    }

    getMarkerBranch = () => {
        const { data, selectedItem } = this.props;

        const Branch = _.find(data[0], o => o.BranchType != 'K' && o.No == 1);

        return (
            <Marker
                key={`Branch_${Branch.BranchCode}`}
                title={Branch.Name}
                position={{ lat: parseFloat(Branch.Latitude), lng: parseFloat(Branch.Longitude) }}
                icon={{
                    url: this.getIconMarker(Branch)
                }} />
        )
    }

    getMarkerKiosk = () => {
        const { data, selectedItem } = this.props;

        const kioskBranch = _.filter(data[0], { No: 1, BranchType: 'K' });

        if (selectedItem.BranchCode.length <= 3 && kioskBranch.length > 0) {
            return kioskBranch.map((kiosk, index) =>
                (
                    <Marker
                        key={`Kiosk_${index}`}
                        title={kiosk.Name}
                        position={{ lat: parseFloat(kiosk.Latitude), lng: parseFloat(kiosk.Longitude) }}
                        icon={{
                            url: this.getIconMarker(kiosk)
                        }} />
                ))
        }
    }

    getcolumnsBranchCA = (isPopup) => {

        const { onShowVirtualDirectionChanged, data } = this.props;

        // let dataAssign = data ? this.props.branchPCAMode ? data[4] : data[2] : [];

        let dataAssign = data ? data[2] : [];

        return [
            {
                title: (<span className={styless['align-center-text']}>Name</span>),
                dataIndex: 'Name',
                key: 'Name',
                width: '33%',
                className: `${styless['td-vertical-bottom']}`,
                render: (text, record, index) => {
                    const filterAssign = this.props.branchPCAMode ? [] : _.filter(dataAssign, { OwnerCode: record.Code });

                    return (
                        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                            {
                                filterAssign.length > 0 && !isPopup
                                    ? (
                                        <Popover content={this.getContentPopover(filterAssign)}>
                                            <span className={styless['text-ellipsis']} style={{ color: '#1890ff' }}>{_.replace(text, 'iosk', '')}</span>
                                        </Popover>
                                    )
                                    : (
                                        <Tooltip title={text} placement="top" >
                                            <span className={styless['text-ellipsis']}>{_.replace(text, 'iosk', '')}</span>
                                        </Tooltip>
                                    )
                            }
                        </div>
                    )
                }
            }, {
                title: (
                    <Tooltip title="Re Assingn mode"><Switch className={styless['mini-slide']} size="small" disabled /></Tooltip>
                ),
                dataIndex: 'PositionCode',
                key: 'PositionCode',
                width: '8%',
                align: 'center',
                className: `blacklight-column ${styless['td-vertical-bottom']}`,
                render: (text, record, index) => {
                    return (<span className={styless['color-soft']}>{text}</span>)
                }
            }, {
                title: (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <span>Branch</span>
                        <span>Penetration</span>
                    </div>
                ),
                dataIndex: 'Total',
                colSpan: 2,
                align: 'center',
                key: 'Total',
                width: '9%',
                className: `${styless['td-vertical-bottom']}`,
                render: (text, record, index) => {
                    return (<span className={styless['align-right-text']}>{text}</span>)
                }
            }, {
                dataIndex: 'TotalPercent',
                colSpan: 0,
                key: 'TotalPercent',
                align: 'center',
                width: '10%',
                className: `${styless['td-vertical-middle']}`,
                render: (text, record, index) => {
                    return (<span className={styless['align-right-text']}>{parseFloat(text).toFixed(0)}%</span>)
                }
            }, {
                title: (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <span>M</span>
                        {
                            !isPopup &&
                            <Tooltip title="Virtual direction for Monday">
                                <Switch
                                    onChange={value => onShowVirtualDirectionChanged(value, 'Mon')}
                                    className={styless['mini-slide']}
                                    size="small" />
                            </Tooltip>
                        }
                    </div>
                ),
                dataIndex: 'Mon',
                key: 'Mon',
                align: 'center',
                className: `Mon ${styless['td-vertical-middle']}`,
                render: (value, row, index) => {
                    if (value != 0) {
                        return value
                    }
                }
            }, {
                title: (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <span>T</span>
                        {
                            !isPopup &&
                            <Tooltip title="Virtual direction for Tuesday">
                                <Switch
                                    onChange={value => onShowVirtualDirectionChanged(value, 'Tue')}
                                    className={styless['mini-slide']}
                                    size="small" />
                            </Tooltip>
                        }
                    </div>
                ),
                dataIndex: 'Tue',
                key: 'Tue',
                align: 'center',
                className: `Tue ${styless['td-vertical-middle']}`,
                render: (value, row, index) => {
                    if (value != 0) {
                        return value
                    }
                }
            }, {
                title: (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <span>W</span>
                        {
                            !isPopup &&
                            <Tooltip title="Virtual direction for Wednesday">
                                <Switch
                                    onChange={value => onShowVirtualDirectionChanged(value, 'Wed')}
                                    className={styless['mini-slide']}
                                    size="small" />
                            </Tooltip>
                        }
                    </div>
                ),
                dataIndex: 'Wed',
                key: 'Wed',
                align: 'center',
                className: `Wed ${styless['td-vertical-middle']}`,
                render: (value, row, index) => {
                    if (value != 0) {
                        return value
                    }
                }
            }, {
                title: (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <span>Th</span>
                        {
                            !isPopup &&
                            <Tooltip title="Virtual direction for Thursday">
                                <Switch
                                    onChange={value => onShowVirtualDirectionChanged(value, 'Thu')}
                                    className={styless['mini-slide']}
                                    size="small" />
                            </Tooltip>
                        }
                    </div>
                ),
                dataIndex: 'Thu',
                key: 'Thu',
                align: 'center',
                className: `Thu ${styless['td-vertical-middle']}`,
                render: (value, row, index) => {
                    if (value != 0) {
                        return value
                    }
                }
            }, {
                title: (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <span>F</span>
                        {
                            !isPopup &&
                            <Tooltip title="Virtual direction for Friday">
                                <Switch
                                    onChange={value => onShowVirtualDirectionChanged(value, 'Fri')}
                                    className={styless['mini-slide']}
                                    size="small" />
                            </Tooltip>
                        }
                    </div>
                ),
                dataIndex: 'Fri',
                key: 'Fri',
                align: 'center',
                className: `Fri ${styless['td-vertical-middle']}`,
                render: (value, row, index) => {
                    if (value != 0) {
                        return value
                    }
                }
            }
        ];
    }

    getcolumnsMarketCA = (Title) => ([{
        title: Title,
        colSpan: 7,
        dataIndex: 'EmpName',
        key: 'EmpName',
        align: 'center',
        width: '9%',
        className: styless['td-vertical-middle'],
        render: (value, row, index) => {
            let dataAssign = _.filter(this.props.data[3], { MarketCode: row.MarketCode, OwnerCode: row.EmpCode });

            const color = ['#03a694', '#023852', '#023852', '#f24738', '#ff5722', '#9e9e9e', '#4caf50', '#673ab7'];

            let chartData = [];
            if (dataAssign.length > 0) {
                chartData.push({ name: row.EmpName, value: row.Total, color: '#03a9f4' });
                chartData = _.union(chartData, dataAssign.map((o, i) => ({ name: o.Name, value: o.Total, color: color[i] })));
            }

            const ActiveEmp = !_.isEmpty(_.find(this.props.selectedCaItem, { Code: row.EmpCode })) ? { border: '2px solid red' } : {}

            return (
                <Popover
                    content={(
                        <div className={styless['assign-detail-ca']}>
                            <div className={styless['marker-tm-pictures']}>
                                <img
                                    className={styless['ca-big-img']}
                                    src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${row.EmpCode}`} />
                                <div>
                                    <span>{`${row.EmpName}`}</span>
                                    <span>{`${row.Mobile} (${row.NickName})`}</span>
                                    <span>{`${moment(row.StartWorking).format('DD-MM-YYYY')} (${row.Period})`}</span>
                                </div>
                                {
                                    dataAssign.length > 0 &&
                                    <div style={{ flex: '1', justifyContent: 'center', alignItems: 'center', maxHeight: '80px' }}>
                                        <PieChart
                                            width={110}
                                            height={120}>
                                            <Pie
                                                data={chartData}
                                                innerRadius={30}
                                                activeIndex={0}
                                                labelLine={false}
                                            >
                                                {
                                                    chartData.map((entry, index) => <Cell fill={entry.color} />)
                                                }
                                                <Label width={30} position="center" content={<CustomLabel value={(parseFloat(_.sumBy(dataAssign, "Total")) / parseFloat(row.Total)) * 100} />}>
                                                </Label>
                                            </Pie>
                                            <Tooltips content={<AssignmentTooltip />} />
                                        </PieChart>
                                    </div>
                                }
                            </div>
                            {
                                // dataAssign.length > 0 &&
                                // <span style={{ fontSize: '12px', marginBottom: '7px' }}>{`${row.MarketName} (${parseFloat(row.Radius).toFixed(2)}Km.) ${row.RadiusFrom}`}</span>
                            }
                            {
                                dataAssign.length > 0 &&
                                <Table
                                    className={styless['table-direction-body-padding']}
                                    size="small"
                                    showHeader={false}
                                    style={{ width: '350px' }}
                                    pagination={false}
                                    columns={this.getcolumnsBranchCA(true)}
                                    dataSource={dataAssign} />
                            }
                        </div>
                    )}>
                    <div
                        style={{
                            position: 'relative'
                        }}>
                        {
                            dataAssign.length > 0 ?
                                <Badge style={{
                                    fontSize: '9px',
                                    height: '15px',
                                    lineHeight: '15px',
                                    top: '-6px',
                                    background: 'transparent',
                                    boxShadow: 'none',
                                    color: '#000'
                                }} count={_.sumBy(dataAssign, "Total")} overflowCount={99} >
                                    <img className={styless['ca-mini-img']} style={ActiveEmp} src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${row.EmpCode}`} />
                                </Badge>
                                :
                                <img className={styless['ca-mini-img']} style={ActiveEmp} src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${row.EmpCode}`} />
                        }
                    </div>
                </Popover>
            )
        }
    }, {
        dataIndex: 'TotalPercent',
        colSpan: 0,
        key: 'TotalPercent',
        align: 'center',
        width: '40px',
        className: styless['td-vertical-middle'],
        render: (text, record, index) => {
            return (<span className={styless['align-right-text']}>{parseFloat(text).toFixed(0)}%</span>)
        }
    }, {
        dataIndex: 'Mon',
        key: 'Mon',
        colSpan: 0,
        align: 'center',
        width: '30px',
        className: `Mon ${styless['td-vertical-middle']}`,
        render: (value, row, index) => {
            if (value != 0) {
                return value
            }
        }
    }, {
        dataIndex: 'Tue',
        key: 'Tue',
        colSpan: 0,
        align: 'center',
        width: '30px',
        className: `Tue ${styless['td-vertical-middle']}`,
        render: (value, row, index) => {
            if (value != 0) {
                return value
            }
        }
    }, {
        dataIndex: 'Wed',
        key: 'Wed',
        colSpan: 0,
        align: 'center',
        width: '30px',
        className: `Wed ${styless['td-vertical-middle']}`,
        render: (value, row, index) => {
            if (value != 0) {
                return value
            }
        }
    }, {
        dataIndex: 'Thu',
        key: 'Thu',
        colSpan: 0,
        align: 'center',
        width: '30px',
        className: `Thu ${styless['td-vertical-middle']}`,
        render: (value, row, index) => {
            if (value != 0) {
                return value
            }
        }
    }, {
        dataIndex: 'Fri',
        key: 'Fri',
        colSpan: 0,
        align: 'center',
        width: '30px',
        className: `Fri ${styless['td-vertical-middle']}`,
        render: (value, row, index) => {
            if (value != 0) {
                return value
            }
        }
    }
    ]);

    getDataMarketTotal = item => {
        const { data } = this.props;

        if (item) {
            return _.filter(this.props.branchPCAMode ? data[5] : data[1], { MarketCode: item.MarketCode });
        }
        else {
            return ([])
        }
    }

    getIconMarker = item => {
        let icon = icon_full_branch;

        switch (item.BranchType) {
            case 'K':
                icon = icon_Keyos
                break;
            case 'P':
                icon = icon_Nano
                break;
            case 'L':
                icon = icon_full_branch
                break;
        }

        return icon;
    }

    getOverlayView = () => {
        const { paths, onMarketMouseOver } = this.props
        console.log(paths)
        return paths.map((itemPath, rootIndex) => (
            itemPath.paths.map((path, index) => index > 0 &&
                (
                    <OverlayView
                        key={`${rootIndex}_${index}`}
                        position={{
                            lat: path.item.Latitude,
                            lng: path.item.Longitude
                        }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        getPixelPositionOffset={getPixelPositionOffset}>
                        <Popover content={(
                            <div style={{ display: 'flex', flexDirection: 'column', margin: '-8px' }}>
                                <Table
                                    key="PopOverTableMarket"
                                    className={styless['table-direction-body-padding']}
                                    size="small"
                                    style={{ width: '240px' }}
                                    pagination={false}
                                    columns={this.getcolumnsMarketCA(
                                        <span style={{ fontSize: '12px', marginBottom: '3px', marginLeft: '3px' }}>
                                            {
                                                `ระยะจากสาขา ${parseFloat(CoordinateDistanceMiles(itemPath.paths[0].item.Latitude, itemPath.paths[0].item.Longitude, path.item.Latitude, path.item.Longitude)).toFixed(1)} Km. `
                                            }
                                            {
                                                index + 1 == itemPath.paths.length ? 'ตลาดนี้เป็นจุดสุดท้าย' : `ตลาดถัดไป ${parseFloat(itemPath.paths[index + 1].KM).toFixed(1)} Km.`
                                            }
                                        </span>
                                    )}
                                    dataSource={this.getDataMarketTotal(path.item)} />
                            </div>
                        )}>
                            <div
                                onMouseEnter={() => onMarketMouseOver(path, true)}
                                onMouseLeave={() => onMarketMouseOver(path, false)}
                                style={{
                                    background: `#FFF`,
                                    border: `3px solid ${itemPath.strokeColor}`,
                                    display: 'flex',
                                    fontSize: '.7rem',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    boxShadow: '2px 3px 2px #adadad'
                                }}>
                                <span>{index}</span>
                            </div>
                        </Popover>
                    </OverlayView>
                ))
        ));
    }

    getBaseMarker = () => {
        const { paths, selectedCaItem, branchPCAMode, data } = this.props;

        if (paths.length > 0) {

            return _.filter(branchPCAMode ? data[4] : data[0], { No: 1 }).map((branch, index) => {
                return (
                    <OverlayView
                        key={9999999 + index}
                        position={{
                            lat: branch.Latitude,
                            lng: branch.Longitude
                        }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        getPixelPositionOffset={getPixelPositionOffset}>
                        <Tooltip title={paths[0].paths[0].item.Name}>
                            <div className={styles['ca-marker-img-container']}>
                                {
                                    _.filter(selectedCaItem, { LinkCode: branch.Code }).map(ca => {
                                        let customColor = {};

                                        if (selectedCaItem.length > 1) {
                                            const caColor = _.find(paths, { Code: ca.Code });

                                            if (!_.isEmpty(caColor)) {
                                                customColor.borderColor = caColor.strokeColor;
                                            }
                                        }

                                        return (<img className={styles['ca-marker-img']} style={customColor} src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${ca.Code}`} />)
                                    })
                                }
                            </div>
                        </Tooltip>
                    </OverlayView>
                )

            });
        }
    }

    render() {
        const { paths, data, selectedItem } = this.props

        const Branch = _.find(data[0], o => o.BranchType != 'K' && o.No == 1);

        return (
            <GoogleMap ref="map" defaultCenter={{ lat: selectedItem.BranchLatitude, lng: selectedItem.BranchLongitude }} defaultZoom={12} >
                {
                    this.getBaseMarker()
                }
                {
                    this.getPolyLine()
                }
                {
                    this.getOverlayView()
                }
                {
                    this.getMarkerKiosk()
                }
                {
                    this.getMarkerBranch()
                }
                {
                    this.getRadiusCircle()
                }
                {
                    <DragRadius item={Branch} index={89898989} />
                }
            </GoogleMap>
        )
    }
}

const MapWithAMarker = withGoogleMap(GMapPath);

const getDirectionsAPI = (origin, destination, index) => {
    return new Promise((resolve, reject) => {
        var request = {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
        };

        // Pass the directions request to the directions service.
        var directionsService = new google.maps.DirectionsService;

        directionsService.route(request, (response, status) => {
            if (status == google.maps.DirectionsStatus.OK) {
                resolve({ response, index });
            } else {
                if (status === 'OVER_QUERY_LIMIT') {
                    reject({ code: 1005, message: 'Over query limit' })
                } else {
                    reject(status);
                }
            }
        });
    });
};

const randomHexColor = () => {
    var x = Math.round(0xffffff * Math.random()).toString(16);
    var y = (6 - x.length);
    var z = "000000";
    var z1 = z.substring(0, y);
    var color = "#" + z1 + x;

    return color;
}

class ModalCaDirectMarket extends Component {

    state = {
        visibleContent: false,
        maximize: false,
        paths: new Array(),
        dateDirection: new Array(),
        selectedCaItem: new Array(),
        branchPCAMode: false,
        marketOver: null,
        fitBounds: true,
        kioskOnlyMode: false,
        previousHistory: [],
    }

    componentDidMount() {
        const { item, getNanoBranchDirection } = this.props;

        getNanoBranchDirection(item.BranchCode);
    }

    // componentWillReceiveProps(nextProps) {
    //     const { item, getNanoBranchDirection } = this.props;

    //     if (nextProps.item) {
    //         if (nextProps.item.BranchCode != item.BranchCode) {
    //             getNanoBranchDirection(item.BranchCode);
    //         }
    //     }
    // }

    findBestRouteToMarkets(origin, markets) {
        let result = [];
        _.forEach(markets, (market, index) => {
            result.push({
                KM: CoordinateDistanceMiles(origin.Latitude, origin.Longitude, market.Latitude, market.Longitude),
                item: market
            });
        })

        return _.orderBy(result, "KM")[0];
    }

    onMarketMouseOver = (item, onOver) => {
        if (onOver) {
            this.setState({ marketOver: item });
        }
        else {
            this.setState({ marketOver: null });
        }
    }

    getStateRenderRoute = (allDateDirection, selectedCaItem, baseBranchCode) => {
        const { NANO_BRANCH_DIRECTION_DATA, item } = this.props;

        const CURRENT_BRANCH = _.find(this.state.branchPCAMode ? NANO_BRANCH_DIRECTION_DATA[4] : NANO_BRANCH_DIRECTION_DATA[0], { LinkCode: baseBranchCode || item.BranchCode, No: 1 });
        const CA_MARKET = this.state.branchPCAMode ? NANO_BRANCH_DIRECTION_DATA[5] : NANO_BRANCH_DIRECTION_DATA[1];

        let allPaths = [];

        if (!_.isEmpty(CURRENT_BRANCH)) {
            let origin = CURRENT_BRANCH;

            if (selectedCaItem.length == 1) {

                if (selectedCaItem[0].PositionCode == 'KCA') {
                    origin = _.find(this.state.branchPCAMode ? NANO_BRANCH_DIRECTION_DATA[4] : NANO_BRANCH_DIRECTION_DATA[0], { No: 1, BranchType: 'K', LinkCode: selectedCaItem[0].LinkCode })
                }

                const marketsByCaCode = _.filter(CA_MARKET, { EmpCode: selectedCaItem[0].Code });

                if (!_.isEmpty(_.find(allDateDirection, o => o == 'Mon'))) {
                    const filter = _.filter(marketsByCaCode, item => item.Mon > 0);

                    if (filter.length > 0) {
                        const monPath = this.findBestRouteToMarket(origin, filter);

                        allPaths.push({
                            strokeColor: '#f7d827',
                            Code: selectedCaItem[0].Code,
                            paths: _.union([
                                {
                                    KM: 0,
                                    item: origin
                                }
                            ], monPath)
                        });
                    }
                }

                if (!_.isEmpty(_.find(allDateDirection, o => o == 'Tue'))) {
                    const filter = _.filter(marketsByCaCode, item => item.Tue > 0);

                    if (filter.length > 0) {
                        const tuePath = this.findBestRouteToMarket(origin, filter);

                        allPaths.push({
                            strokeColor: '#ef3ecf',
                            Code: selectedCaItem[0].Code,
                            paths: _.union([
                                {
                                    KM: 0,
                                    item: origin
                                }
                            ], tuePath)
                        });
                    }
                }

                if (!_.isEmpty(_.find(allDateDirection, o => o == 'Wed'))) {
                    const filter = _.filter(marketsByCaCode, item => item.Wed > 0);

                    if (filter.length > 0) {
                        const wedPath = this.findBestRouteToMarket(origin, filter);

                        allPaths.push({
                            strokeColor: '#17b21e',
                            Code: selectedCaItem[0].Code,
                            paths: _.union([
                                {
                                    KM: 0,
                                    item: origin
                                }
                            ], wedPath)
                        });
                    }
                }

                if (!_.isEmpty(_.find(allDateDirection, o => o == 'Thu'))) {
                    const filter = _.filter(marketsByCaCode, item => item.Thu > 0);

                    if (filter.length > 0) {
                        const thuPath = this.findBestRouteToMarket(origin, filter);

                        allPaths.push({
                            strokeColor: '#d64713',
                            Code: selectedCaItem[0].Code,
                            paths: _.union([
                                {
                                    KM: 0,
                                    item: origin
                                }
                            ], thuPath)
                        });
                    }
                }

                if (!_.isEmpty(_.find(allDateDirection, o => o == 'Fri'))) {
                    const filter = _.filter(marketsByCaCode, item => item.Fri > 0);

                    if (filter.length > 0) {
                        const friPath = this.findBestRouteToMarket(origin, filter);

                        allPaths.push({
                            strokeColor: '#12c0e8',
                            Code: selectedCaItem[0].Code,
                            paths: _.union([
                                {
                                    KM: 0,
                                    item: origin
                                }
                            ], friPath)
                        });
                    }
                }
            }
            else {
                if (allDateDirection.length > 0) {

                    selectedCaItem.map((ca, index) => {

                        if (ca.PositionCode == 'KCA') {
                            origin = _.find(this.state.branchPCAMode ? NANO_BRANCH_DIRECTION_DATA[4] : NANO_BRANCH_DIRECTION_DATA[0], { No: 1, BranchType: 'K' })
                        }
                        else {
                            origin = CURRENT_BRANCH;
                        }


                        const marketsByCaCode = _.filter(CA_MARKET, { EmpCode: ca.Code });

                        if (marketsByCaCode.length > 0) {
                            let filter = [];

                            switch (allDateDirection[0]) {
                                case 'Mon':
                                    filter = _.filter(marketsByCaCode, item => item.Mon > 0);
                                    break;
                                case 'Tue':
                                    filter = _.filter(marketsByCaCode, item => item.Tue > 0);
                                    break;
                                case 'Wed':
                                    filter = _.filter(marketsByCaCode, item => item.Wed > 0);
                                    break;
                                case 'Thu':
                                    filter = _.filter(marketsByCaCode, item => item.Thu > 0);
                                    break;
                                case 'Fri':
                                    filter = _.filter(marketsByCaCode, item => item.Fri > 0);
                                    break;
                            }

                            if (filter.length > 0) {
                                const caPath = this.findBestRouteToMarket(origin, filter);

                                let UniqColor = randomHexColor();

                                do {
                                    UniqColor = randomHexColor();
                                } while (_.filter(selectedCaItem, { UniqColor: UniqColor }).length > 0)

                                allPaths.push({
                                    strokeColor: UniqColor,
                                    Code: ca.Code,
                                    paths: _.union([
                                        {
                                            KM: 0,
                                            item: origin
                                        }
                                    ], caPath)
                                });
                            }
                        }
                    })
                }
            }
        }

        return allPaths;
    }

    onShowVirtualDirectionChanged = (open, date) => {
        const { selectedCaItem } = this.state;

        let allDateDirection = _.clone(this.state.dateDirection);
        allDateDirection.push(date);

        if (!open) {
            _.remove(allDateDirection, item => item == date);
        }

        if (selectedCaItem.length > 1) {
            _.remove(allDateDirection, item => item != date);
        }

        let allPaths = [];

        if (selectedCaItem.length > 0) {
            allPaths = this.getStateRenderRoute(allDateDirection, this.state.selectedCaItem);
        }

        this.setState({ dateDirection: allDateDirection, paths: allPaths });
    }

    findBestRouteToMarket(origin, markets) {
        let resultPaths = [];
        let originPath = origin;
        let originMarkets = _.cloneDeep(markets);

        for (let i = 0; i <= originMarkets.length; i++) {

            const nextPath = this.findBestRouteToMarkets(originPath, originMarkets);

            resultPaths.push(nextPath);

            originPath = nextPath.item;

            _.remove(originMarkets, (item, index) => item == nextPath.item);

            i = 0;
        }

        return resultPaths;
    }

    setVisibleContent = () => {
        this.setState({
            visibleContent: !this.state.visibleContent
        })
    }

    onSelectedCAChange = (checked, record) => {
        let tempSelectedCaItem = _.cloneDeep(this.state.selectedCaItem);
        const { dateDirection } = this.state;

        if (!checked) {
            _.remove(tempSelectedCaItem, { Code: record.Code });
        }
        else {
            tempSelectedCaItem.push(record);
        }

        let state = { selectedCaItem: tempSelectedCaItem };
        let allPaths = [];

        if (tempSelectedCaItem.length > 1) {
            if (dateDirection.length > 1 && tempSelectedCaItem.length > 1) {
                state.dateDirection = [];
            }
            else {
                if (dateDirection.length == 1) {
                    allPaths = this.getStateRenderRoute(dateDirection, tempSelectedCaItem);
                }
            }
        }
        else if (tempSelectedCaItem.length == 1) {
            allPaths = this.getStateRenderRoute(dateDirection, tempSelectedCaItem);
        }

        state.paths = allPaths;

        this.setState(state);
    }

    onSelectedKioskChange = (checked, record) => {
        const { paths, dateDirection, selectedCaItem } = this.state;
        let newPaths = new Array(), newDateDirection = new Array(), newSelectedCaItem = new Array();

        if (checked) {
            let previousHistory = [
                paths,
                dateDirection,
                selectedCaItem
            ];

            this.setState({
                kioskOnlyMode: record,
                previousHistory: this.state.previousHistory.length > 0 ? this.state.previousHistory : previousHistory,
                paths: newPaths,
                dateDirection: newDateDirection,
                selectedCaItem: newSelectedCaItem
            });
        } else {
            const { previousHistory } = this.state;

            if (previousHistory.length > 0) {
                newPaths = previousHistory[0];
                newDateDirection = previousHistory[1];
                newSelectedCaItem = previousHistory[2];
            }

            this.setState({
                kioskOnlyMode: null,
                previousHistory: new Array(),
                paths: newPaths,
                dateDirection: newDateDirection,
                selectedCaItem: newSelectedCaItem
            });
        }
    }

    onBranchPCAModeChange = checked => this.setState({ branchPCAMode: checked, selectedCaItem: new Array(), path: new Array(), dateDirection: new Array(), previousHistory: new Array() })

    render() {
        const { closeCaDirectionToMarket, item, NANO_BRANCH_DIRECTION_DATA, NANO_BRANCH_DIRECTION_DATA_STATUS } = this.props

        const start_work_date = !_.isEmpty(item && item.TM_WorkPeriod)
            ? moment
                .duration(moment(new Date()).diff(moment(item.TM_WorkPeriod)))
                ._data
            : '';

        const work_date_format = `Work Period : ${start_work_date.years}.${start_work_date.months}.${start_work_date.days}`
        if (item) {
            item.work_date_format = work_date_format;
        }

        const iconVisible = this.state.visibleContent
            ? 'plus-square'
            : 'minus-square';
        const titleVisible = this.state.visibleContent
            ? 'Show'
            : 'Hide';

        return (
            <Modal
                wrapClassName={`parent_salesummary ${styles['modalParentDirectionInfo']}`}
                className={styles['modalDirectionInfo']}
                visible={true}
                footer={null}
                closable={false}
                maskClosable={false}
                mask={false}
                destroyOnClose={true}
                getContainer={() => document.getElementById('ca-directino-market')}>
                <article className={styles['wrapper']}>

                    <div className={styless['headerss']}>
                        <div className={styles['ca-imgs']}>
                            <Popover
                                placement="left"
                                content={(
                                    <div className={styles['marker-tm-picture']}>
                                        <img
                                            className={styles['ca-big-img']}
                                            src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${item && item.TM_Code}`} />
                                        <span>{`${item && item.TM_Name}`} {`(${item && item.TM_NickName})`}</span>
                                        <span>{`${work_date_format}`}</span>
                                        <span>{`${item && item.TM_Tel}`}</span>
                                    </div>
                                )}>
                                <img
                                    src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${item && item.TM_Code}`} />
                            </Popover>
                        </div>

                        <span
                            className={styles['title-img']}
                            style={{
                                marginRight: '45px',
                                marginLeft: '45px'
                            }}>
                            {item && item.BranchName}
                        </span>

                        {/* <Icon
                            onClick={this.setVisibleContent}
                            className={styles["trigger-close"]}
                            type={iconVisible} /> */}

                        <Tooltip title='Close'>
                            <Icon
                                onClick={closeCaDirectionToMarket}
                                className={styles["trigger-close"]}
                                type='close' />
                        </Tooltip>
                    </div>
                    {
                        !this.state.visibleContent &&
                        <Layout>
                            {
                                NANO_BRANCH_DIRECTION_DATA_STATUS &&
                                    NANO_BRANCH_DIRECTION_DATA.length > 0 ?
                                    <Layout
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            backgroundColor: '#FFF',
                                            padding: '5px',
                                            minWidth: '1200px',
                                            height: '670px'
                                        }}>
                                        <div
                                            className={`${styles['detail-container']} Cancel`}
                                            style={{
                                                display: 'flex',
                                                flex: '1',
                                                width: '500px',
                                                height: '100%'
                                            }}>
                                            <MapWithAMarker
                                                paths={this.state.paths}
                                                selectedItem={item}
                                                selectedCaItem={this.state.selectedCaItem}
                                                data={NANO_BRANCH_DIRECTION_DATA}
                                                branchPCAMode={this.state.branchPCAMode}
                                                onMarketMouseOver={this.onMarketMouseOver}
                                                fitBounds={this.state.fitBounds}
                                                containerElement={< div style={{ height: `100%` }} />}
                                                mapElement={< div style={{ height: `100%` }} />} />
                                            <div id='popover-content' style={{
                                                position: 'absolute',
                                                right: '460px',
                                                top: '35px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'flex-end'
                                            }}>
                                            </div>
                                        </div>
                                        <div
                                            className={`Cancel`}
                                            style={{
                                                width: '450px',
                                                height: '100%'
                                            }}>
                                            <CaDirectionProfile
                                                data={NANO_BRANCH_DIRECTION_DATA}
                                                selectedItem={item}
                                                paths={this.state.paths}
                                                selectedCaItem={this.state.selectedCaItem}
                                                dateDirection={this.state.dateDirection}
                                                onSelectedCAChange={this.onSelectedCAChange}
                                                onSelectedKioskChange={this.onSelectedKioskChange}
                                                branchPCAMode={this.state.branchPCAMode}
                                                onBranchPCAModeChange={this.onBranchPCAModeChange}
                                                marketOver={this.state.marketOver}
                                                kioskOnlyMode={this.state.kioskOnlyMode}
                                                onShowVirtualDirectionChanged={this.onShowVirtualDirectionChanged} />
                                        </div>
                                    </Layout>
                                    :
                                    <Layout
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: '#FFF',
                                            padding: '5px',
                                            minWidth: '1200px',
                                            height: '750px'
                                        }}>
                                        <Skeleton loading={true} active />
                                    </Layout>
                            }
                        </Layout>
                    }
                </article>
            </Modal>
        )
    }

}

export default connect((state) => ({
    NANO_BRANCH_DIRECTION_DATA: state.NANO_BRANCH_DIRECTION_DATA,
    NANO_BRANCH_DIRECTION_NOTE_DATA: state.NANO_BRANCH_DIRECTION_NOTE_DATA,
    NANO_BRANCH_DIRECTION_DATA_STATUS: state.NANO_BRANCH_DIRECTION_DATA_STATUS
}), {
        getNanoBranchDirection: getNanoBranchDirection
    }
)(ModalCaDirectMarket)