import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    Tooltip,
    Table,
    Checkbox,
    Badge,
    Popover,
    Switch,
    Icon
} from 'antd';

import {
    PieChart,
    Pie,
    Cell,
    Tooltip as Tooltips,
    Label
} from 'recharts'

import _ from 'lodash'
import styles from './index.scss'

import Scrollbar from 'react-smooth-scrollbar';
import SmoothScrollbar, { ScrollbarPlugin } from 'smooth-scrollbar';

// SmoothScrollbar.use(ScrollToDelta);

import moment from 'moment'
import CustomPopOver from './CustomPopover'

const numberWithCommas = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
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
                <div key={`${label}_${coordinate.x}_${coordinate.y}`} className={styles['custom-tooltip']}>
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

class CaDirectionProfile extends Component {

    state = {
        showmore: false
    }

    getContentPopover = data => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', marginBottom: '5px', marginLeft: '3px' }}>TM Assignment</span>
                <Table
                    className={styles['table-direction-body-padding']}
                    size="small"
                    showHeader={false}
                    style={{ width: '370px' }}
                    pagination={false}
                    columns={this.getcolumnsBranchCA(true)}
                    dataSource={data} />
            </div>
        )
    }

    getBranchTableCheckbox = (record, isPopup) => {
        const { selectedCaItem, selectedItem, onSelectedCAChange, onSelectedKioskChange, kioskOnlyMode } = this.props;

        let checked = _.filter(selectedCaItem, { Code: record.Code }).length > 0 ? true : false;
        let kioskChecked = false;
        let disabledCaChecked = false;

        if (kioskOnlyMode) {
            kioskChecked = kioskOnlyMode.Code == record.Code;
            disabledCaChecked = true;
        }

        let customStyle = {};
        if (selectedItem.BranchCode.length == 3) {
            customStyle.marginLeft = "-24px";
        }

        if (record.No == 2 && !isPopup) {
            const BranchData = this.getDataBranchTotal();
            if ((BranchData[0].children || []).length == 0) {
                customStyle = {};
            }
            return (<Checkbox onChange={(e) => onSelectedCAChange(e.target.checked, record)} checked={checked} style={customStyle} disabled={disabledCaChecked} />)
        }

        if (record.No == 1 && record.BranchType == 'K' && selectedItem.BranchCode.length == 3) {
            return (<Checkbox onChange={(e) => onSelectedKioskChange(e.target.checked, record)} checked={kioskChecked} style={customStyle} />)
        }
    }

    getcolumnsBranchCA = (isPopup) => {

        const { onShowVirtualDirectionChanged, data, dateDirection, selectedCaItem, kioskOnlyMode } = this.props;

        let dataAssign = data ? data[2] : [];

        const MonChecked = _.filter(dateDirection, o => o == "Mon").length > 0 ? true : false;
        const TueChecked = _.filter(dateDirection, o => o == "Tue").length > 0 ? true : false;
        const WedChecked = _.filter(dateDirection, o => o == "Wed").length > 0 ? true : false;
        const ThuChecked = _.filter(dateDirection, o => o == "Thu").length > 0 ? true : false;
        const FriChecked = _.filter(dateDirection, o => o == "Fri").length > 0 ? true : false;
        const disabledDateChecked = !_.isEmpty(kioskOnlyMode);

        const textSwitchTooltip = this.state.branchPCAMode ? 'Normal Mode' : 'Assign Mode';

        const disabledAssignMode = dataAssign.length > 0 ? false : true;

        return [
            {
                title: (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'bottom' }}><span className={styles['align-center-text']}>Name</span></div>),
                dataIndex: 'Name',
                width: '33%',
                className: `${styles['td-vertical-middle']} th-bottom`,
                render: (text, record, index) => {
                    const filterAssign = _.filter(dataAssign, { OwnerCode: record.Code });

                    let customStyle = {};

                    if (this.props.selectedItem.BranchCode.length > 3 && record.No == 1) {
                        customStyle.marginLeft = "24px";
                    }

                    return (
                        <div style={{ display: 'inline-flex', alignItems: 'center', ...customStyle }}>
                            {
                                this.getBranchTableCheckbox(record, isPopup)
                            }
                            {
                                filterAssign.length > 0 && !isPopup
                                    ? (
                                        <CustomPopOver content={this.getContentPopover(filterAssign)}>
                                            <span className={styles['text-ellipsis']} style={{ color: '#1890ff', padding: '0 8px' }}>{_.replace(text, 'iosk', '')}</span>
                                        </CustomPopOver>
                                    )
                                    : (
                                        <Tooltip title={text} placement="top" >
                                            <span className={styles['text-ellipsis']}>{_.replace(text, 'iosk', '')}</span>
                                        </Tooltip>
                                    )
                            }
                        </div>
                    )
                }
            }, {
                title: (
                    <Tooltip title={textSwitchTooltip}><Switch onChange={this.props.onBranchPCAModeChange} checked={this.props.branchPCAMode} className={styles['mini-slide']} size="small" disabled={disabledAssignMode} /></Tooltip>
                ),
                dataIndex: 'PositionCode',
                width: '8%',
                align: 'center',
                className: `blacklight-column ${styles['td-vertical-middle']} th-bottom`,
                render: (text, record, index) => {
                    return (<span className={styles['color-soft']}>{text}</span>)
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
                width: '9%',
                className: `${styles['td-vertical-middle']}`,
                render: (text, record, index) => {
                    return (<span className={styles['align-right-text']}>{text}</span>)
                }
            }, {
                dataIndex: 'TotalPercent',
                colSpan: 0,
                align: 'center',
                width: '10%',
                className: `${styles['td-vertical-middle']}`,
                render: (text, record, index) => {
                    return (<span className={styles['align-right-text']}>{parseFloat(text).toFixed(0)}%</span>)
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
                                    checked={MonChecked}
                                    disabled={disabledDateChecked}
                                    onChange={value => onShowVirtualDirectionChanged(value, 'Mon')}
                                    className={styles['mini-slide']}
                                    size="small" />
                            </Tooltip>
                        }
                    </div>
                ),
                dataIndex: 'Mon',
                align: 'center',
                className: `Mon ${styles['td-vertical-middle']}`,
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
                                    checked={TueChecked}
                                    disabled={disabledDateChecked}
                                    onChange={value => onShowVirtualDirectionChanged(value, 'Tue')}
                                    className={styles['mini-slide']}
                                    size="small" />
                            </Tooltip>
                        }
                    </div>
                ),
                dataIndex: 'Tue',
                align: 'center',
                className: `Tue ${styles['td-vertical-middle']}`,
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
                                    checked={WedChecked}
                                    disabled={disabledDateChecked}
                                    onChange={value => onShowVirtualDirectionChanged(value, 'Wed')}
                                    className={styles['mini-slide']}
                                    size="small" />
                            </Tooltip>
                        }
                    </div>
                ),
                dataIndex: 'Wed',
                align: 'center',
                className: `Wed ${styles['td-vertical-middle']}`,
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
                                    checked={ThuChecked}
                                    disabled={disabledDateChecked}
                                    onChange={value => onShowVirtualDirectionChanged(value, 'Thu')}
                                    className={styles['mini-slide']}
                                    size="small" />
                            </Tooltip>
                        }
                    </div>
                ),
                dataIndex: 'Thu',
                align: 'center',
                className: `Thu ${styles['td-vertical-middle']}`,
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
                                    checked={FriChecked}
                                    disabled={disabledDateChecked}
                                    onChange={value => onShowVirtualDirectionChanged(value, 'Fri')}
                                    className={styles['mini-slide']}
                                    size="small" />
                            </Tooltip>
                        }
                    </div>
                ),
                dataIndex: 'Fri',
                align: 'center',
                className: `Fri ${styles['td-vertical-middle']}`,
                render: (value, row, index) => {
                    if (value != 0) {
                        return value
                    }
                }
            }
        ];
    }


    getcolumnsMarketCA = () => {
        const MarketDPDTitle = (<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Icon type="dollar" style={{ fontSize: '16px', marginRight: '5px' }} />
            <span style={{ fontSize: '12px' }}>Portfolio Quality Classification Matric</span>
        </div>);

        return ([
            {
                title: (<span>Market Name</span>),
                dataIndex: 'MarketName',
                width: '33%',
                className: styles['margin-top-td'],
                render: (value, row, index) => {

                    const data = this.getDataMarketTotal();

                    const obj = {
                        children: (
                            <Tooltip title={value} placement="top" >
                                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                    <span className={styles['text-ellipsis']}>{value}</span>
                                </div>
                            </Tooltip>
                        ),
                        props: {}
                    }

                    if (index < data.length && (index + 1) < data.length) {
                        if (data[index + 1].MarketCode == row.MarketCode) {
                            obj.props.rowSpan = _
                                .filter(data, { MarketCode: row.MarketCode })
                                .length;
                        }
                    }

                    if (index > 0 && (index - 1) >= 0) {
                        // These two are merged into above cell
                        if (data[index - 1].MarketCode == row.MarketCode) {
                            obj.props.rowSpan = 0;
                        }
                    }

                    return obj;
                }
            }, {
                title: (
                    <Tooltip title="Change Mode"><Switch className={styles['mini-slide']} size="small" disabled /></Tooltip>
                ),
                dataIndex: 'Total',
                width: '7%',
                align: 'center',
                className: `blacklight-column ${styles['margin-top-td']}`,
                render: (value, row, index) => {
                    const data = this.getDataMarketTotal();

                    // const sumTotalByMarket = _.sumBy(_.filter(data, { MarketCode: row.MarketCode }), "Total");

                    const obj = {
                        children: (<span className={styles['color-soft']}>{row.Total}</span>),
                        props: {}
                    }

                    if (index < data.length && (index + 1) < data.length) {
                        if (data[index + 1].MarketCode == row.MarketCode) {
                            obj.props.rowSpan = _
                                .filter(data, { MarketCode: row.MarketCode })
                                .length;
                        }
                    }

                    if (index > 0 && (index - 1) >= 0) {
                        // These two are merged into above cell
                        if (data[index - 1].MarketCode == row.MarketCode) {
                            obj.props.rowSpan = 0;
                        }
                    }

                    return obj;
                }
            }, {
                colSpan: 2,
                dataIndex: 'EmpName',
                align: 'center',
                width: '9%',
                className: styles['td-vertical-middle'],
                render: (value, row, index) => {
                    let dataAssign = _.filter(this.props.data[3], { MarketCode: row.MarketCode, OwnerCode: row.EmpCode });

                    const color = ['#03a694', '#023852', '#023852', '#f24738', '#ff5722', '#9e9e9e', '#4caf50', '#673ab7'];

                    let chartData = [];
                    if (dataAssign.length > 0) {
                        chartData.push({ name: row.EmpName, value: row.Total, color: '#03a9f4' });
                        chartData = _.union(chartData, dataAssign.map((o, i) => ({ name: o.Name, value: o.Total, color: color[i] })));
                    }

                    const { paths } = this.props;

                    let borderColor = ''

                    if (paths.length > 1) {
                        const findColor = _.find(paths, { Code: row.EmpCode });
                        if (!_.isEmpty(findColor)) {
                            borderColor = findColor.strokeColor;
                        }
                    }

                    return (
                        <CustomPopOver
                            content={(
                                <div className={styles['assign-detail-ca']} style={{ minWidth: '250px' }}>
                                    <div className={styles['marker-tm-pictures']}>
                                        <img
                                            className={styles['ca-big-img']}
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
                                                    key={Math.random()}
                                                    width={110}
                                                    height={120}>
                                                    <Pie
                                                        key={Math.random()}
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
                                            className={styles['table-direction-body-padding']}
                                            size="small"
                                            showHeader={false}
                                            style={{ width: '370px' }}
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
                                            <img className={styles['ca-mini-img']} style={{ border: borderColor && `3px solid ${borderColor}` }} src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${row.EmpCode}`} />
                                        </Badge>
                                        :
                                        <img className={styles['ca-mini-img']} style={{ border: borderColor && `3px solid ${borderColor}` }} src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${row.EmpCode}`} />
                                }
                            </div>
                        </CustomPopOver>
                    )
                }
            }, {
                dataIndex: 'TotalPercent',
                colSpan: 0,
                align: 'center',
                width: '10%',
                className: styles['td-vertical-middle'],
                render: (text, record, index) => {
                    return (<span className={styles['align-right-text']}>{parseFloat(text).toFixed(0)}%</span>)
                }
            }, {
                title: 'M',
                dataIndex: 'Mon',
                align: 'center',
                width: '34px',
                className: `Mon ${styles['td-vertical-middle']}`,
                render: (value, row, index) => {
                    if (value != 0) {
                        return <CustomPopOver
                            trigger="click"
                            title={MarketDPDTitle}
                            content={this.getMarketDPDTable(value, row, index, 'Mon')}>
                            <div className={`${styles['go-market']} ${row.Mon_Miss == 0 && styles['no-go-market']}`}>{value}</div>
                        </CustomPopOver>
                    }
                }
            }, {
                title: 'T',
                dataIndex: 'Tue',
                align: 'center',
                width: '34px',
                className: `Tue ${styles['td-vertical-middle']}`,
                render: (value, row, index) => {
                    if (value != 0) {
                        return <CustomPopOver
                            trigger="click"
                            title={MarketDPDTitle}
                            content={this.getMarketDPDTable(value, row, index, 'Tue')}>
                            <div className={`${styles['go-market']} ${row.Tue_Miss == 0 && styles['no-go-market']}`}>{value}</div>
                        </CustomPopOver>
                    }
                }
            }, {
                title: 'W',
                dataIndex: 'Wed',
                align: 'center',
                width: '34px',
                className: `Wed ${styles['td-vertical-middle']}`,
                render: (value, row, index) => {
                    if (value != 0) {
                        return <CustomPopOver
                            trigger="click"
                            title={MarketDPDTitle}
                            content={this.getMarketDPDTable(value, row, index, 'Wed')}>
                            <div className={`${styles['go-market']} ${row.Wed_Miss == 0 && styles['no-go-market']}`}>{value}</div>
                        </CustomPopOver>
                    }
                }
            }, {
                title: 'Th',
                dataIndex: 'Thu',
                align: 'center',
                width: '35px',
                className: `Thu ${styles['td-vertical-middle']}`,
                render: (value, row, index) => {
                    if (value != 0) {
                        return <CustomPopOver
                            trigger="click"
                            title={MarketDPDTitle}
                            content={this.getMarketDPDTable(value, row, index, 'Thu')}>
                            <div className={`${styles['go-market']} ${row.Thu_Miss == 0 && styles['no-go-market']}`}>{value}</div>
                        </CustomPopOver>
                    }
                }
            }, {
                title: 'F',
                dataIndex: 'Fri',
                align: 'center',
                width: '34px',
                className: `Fri ${styles['td-vertical-middle']}`,
                render: (value, row, index) => {
                    if (value != 0) {
                        return <CustomPopOver
                            trigger="click"
                            title={MarketDPDTitle}
                            content={this.getMarketDPDTable(value, row, index, 'Fri')}>
                            <div className={`${styles['go-market']} ${row.Fri_Miss == 0 && styles['no-go-market']}`}>{value}</div>
                        </CustomPopOver>
                    }
                }
            }
        ])
    };

    getMarketDPDTable = (value, row, index, clickdate) => {
        let date = '';

        switch (clickdate) {
            case 'Mon':
                date = row.Mon;
                break;
            case 'Tue':
                date = row.Tue;
                break;
            case 'Wed':
                date = row.Wed;
                break;
            case 'Thu':
                date = row.Thu;
                break;
            case 'Fri':
                date = row.Fri;
                break;
        }

        return (
            <Table
                key="TableMarket"
                className={styles['table-direction-body-padding']}
                style={{ width: '310px' }}
                size="small"
                bordered={true}
                pagination={false}
                rowClassName={this.onRowMarketDPDClassName}
                columns={this.getcolumnsMarketDPD()}
                dataSource={this.getDataMarketDPD()} />
        )
    }

    getcolumnsMarketDPD = () => ([
        {
            title: (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <span>Collection KPI</span>
                </div>
            ),
            dataIndex: 'Title',
            className: styles['td-vertical-bottom'],
            width: '80px',
            render: (text, record, index) => {
                let style = {
                    width: '75%',
                    marginLeft: '0'
                }

                if ((record.children || []).length <= 0) {
                    style.marginLeft = '-24px';
                    style.width = '95%';
                }

                return (
                    <div style={{ display: 'inline-flex', alignItems: 'center', ...style }}>
                        <span className={styles['text-ellipsis']}>{text}</span>
                    </div>
                )
            }
        }, {
            title: (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <span>Total</span>
                    <span>Cust.</span>
                </div>
            ),
            dataIndex: 'TotalCust',
            className: styles['td-vertical-middle'],
            render: (text, record, index) => {
                return (<span className={styles['align-center-text']}>{text}</span>)
            }
        }, {
            title: (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <span>%</span>
                    <span>Succ.</span>
                </div>
            ),
            dataIndex: 'PercentSuccess',
            className: styles['td-vertical-middle'],
            render: (text, record, index) => {
                return (<span className={styles['align-center-text']}>{parseFloat(text).toFixed(0)}%</span>)
            }
        }, {
            title: (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <span>#</span>
                    <span>Unpaid</span>
                </div>
            ),
            dataIndex: 'Unpaid',
            className: styles['td-vertical-middle'],
            render: (text, record, index) => {
                return (<span className={styles['align-center-text']}>{text}</span>)
            }
        }, {
            title: (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <span>$</span>
                    <span>Paid</span>
                </div>
            ),
            dataIndex: 'PaidAmount',
            className: styles['td-vertical-middle'],
            render: (text, record, index) => {
                return (<span className={styles['align-right-text']}>{numberWithCommas(text)}</span>)
            }
        }
    ]);

    getDataMarketDPD = () => {
        return [{
            Level: 1,
            Title: 'New 0% WDPD',
            TotalCust: 30,
            PercentSuccess: 83,
            Unpaid: -5,
            PaidAmount: 125000
        }, {
            Level: 2,
            Title: 'Total Buckets',
            TotalCust: 700,
            PercentSuccess: 76,
            Unpaid: -165,
            PaidAmount: 26750000
        }, {
            Level: 3,
            Title: 'Current 40.5%',
            TotalCust: 640,
            PercentSuccess: 80,
            Unpaid: -128,
            PaidAmount: 25600000,
            children: [
                {
                    Level: 4,
                    Title: 'Week 0 (0.1%)',
                    TotalCust: 500,
                    PercentSuccess: 80,
                    Unpaid: -100,
                    PaidAmount: 20000000
                }, {
                    Level: 5,
                    Title: 'WDPD 10.5%',
                    TotalCust: 140,
                    PercentSuccess: 80,
                    Unpaid: -28,
                    PaidAmount: 5600000,
                    children: [{
                        Level: 51,
                        Title: 'W1 (1-7 Day)',
                        TotalCust: 50,
                        PercentSuccess: 80,
                        Unpaid: -10,
                        PaidAmount: 2000000
                    }, {
                        Level: 52,
                        Title: 'W2 (8-14 Day)',
                        TotalCust: 40,
                        PercentSuccess: 80,
                        Unpaid: -8,
                        PaidAmount: 1600000
                    }, {
                        Level: 53,
                        Title: 'W3 (15-21 Day)',
                        TotalCust: 30,
                        PercentSuccess: 83,
                        Unpaid: -5,
                        PaidAmount: 1250000
                    }, {
                        Level: 54,
                        Title: 'W4 (22-30 Day)',
                        TotalCust: 20,
                        PercentSuccess: 75,
                        Unpaid: -5,
                        PaidAmount: 750000
                    }]
                }
            ]
        }, {
            Level: 6,
            Title: 'X-Days 15.8%',
            TotalCust: 38,
            PercentSuccess: 55,
            Unpaid: -17,
            PaidAmount: 1050000,
            children: [{
                Level: 61,
                Title: 'W5 (1-7 Day)',
                TotalCust: 25,
                PercentSuccess: 60,
                Unpaid: -10,
                PaidAmount: 750000
            }, {
                Level: 62,
                Title: 'W6 (8-14 Day)',
                TotalCust: 10,
                PercentSuccess: 50,
                Unpaid: -5,
                PaidAmount: 250000
            }, {
                Level: 63,
                Title: 'W7 (15-21 Day)',
                TotalCust: 2,
                PercentSuccess: 50,
                Unpaid: -1,
                PaidAmount: 50000
            }, {
                Level: 64,
                Title: 'W8 (22-30 Day)',
                TotalCust: 1,
                PercentSuccess: 0,
                Unpaid: -1,
                PaidAmount: 0
            }]
        }, {
            Level: 7,
            Title: 'MDPD 23.4%',
            TotalCust: 17,
            PercentSuccess: 12,
            Unpaid: -15,
            PaidAmount: 100000,
            children: [{
                Level: 71,
                Title: 'M1 (31-60 Day)',
                TotalCust: 12,
                PercentSuccess: 17,
                Unpaid: -10,
                PaidAmount: 100000
            }, {
                Level: 72,
                Title: 'M2 (61-90 Day)',
                TotalCust: 5,
                PercentSuccess: 0,
                Unpaid: -5,
                PaidAmount: 0
            }]
        }, {
            Level: 8,
            Title: 'NPL 5.6%',
            TotalCust: 5,
            PercentSuccess: 0,
            Unpaid: -5,
            PaidAmount: 0,
            children: [{
                Level: 81,
                Title: 'LY NPL',
                TotalCust: 3,
                PercentSuccess: 0,
                Unpaid: -3,
                PaidAmount: 0
            }, {
                Level: 82,
                Title: 'New NPL',
                TotalCust: 2,
                PercentSuccess: 0,
                Unpaid: -2,
                PaidAmount: 0
            }]
        }];
    }

    onRowMarketDPDClassName = (record, index) => {

        switch (record.Level) {
            case 1:
                return styles['hilight-level-1'];
                break;
            case 2:
                return styles['hilight-level-2'];
                break;
            case 3:
                return styles['hilight-level-3'];
                break;
            case 4:
                return styles['hilight-level-4'];
                break;
            case 5:
                return styles['hilight-level-5'];
                break;
            case 6:
                return styles['hilight-level-6'];
                break;
            case 7:
                return styles['hilight-level-7'];
                break;
            case 8:
                return styles['hilight-level-8'];
                break;
            default:
                return styles['hilight-level-1'];
                break;
        }
    }

    getDataBranchTotal = () => {
        const { data, selectedItem } = this.props;
        let result = [], RootBranchData = {}, ChildredData = [], CaBranchData = [];
        const BranchData = this.props.branchPCAMode ? data[4] : data[0];

        RootBranchData = _.find(BranchData, { LinkCode: selectedItem.BranchCode, No: 1 });
        CaBranchData = [];

        if (RootBranchData) {
            // if(RootBranchData.BranchType != "K")
            // {
            // CaBranchData =_.orderBy(_.filter(BranchData, o => o.No == 2 && o.BranchType != 'K'), ["PositionCode", "LinkCode"]);
            // }
            // else
            // {
            CaBranchData = _.orderBy(_.filter(BranchData, o => o.No == 2), ["PositionCode", "LinkCode"]);
            // }

            if (selectedItem.BranchCode.length <= 3) {
                ChildredData = _.orderBy(_.filter(BranchData, o => o.LinkCode.length > 3 && o.No < 2), ["LinkCode", "No"]);

                if (!_.isEmpty(RootBranchData) && ChildredData.length > 0) {
                    RootBranchData.children = ChildredData;
                }
            }

            if (!_.isEmpty(RootBranchData)) {
                result.push(RootBranchData);
            }

            if (CaBranchData.length > 0) {
                if (this.state.showmore) {
                    result.push(...CaBranchData);
                }
                else {
                    result.push(...(CaBranchData.slice(0, 2)))
                }
            }
        }

        return result;
    }

    getFooterBranchTotal = () => {
        const { data, selectedCaItem } = this.props;
        const countCA = _.uniqBy(_.filter(this.props.branchPCAMode ? data[4] : data[0], o => o.No != 1), "Code").length;
        const maxShowCa = 2;

        if (countCA > maxShowCa) {
            const icon = this.state.showmore ? "caret-up" : "caret-down";
            const text = this.state.showmore ? "Hiden" : `Show more (${countCA - maxShowCa}) ${selectedCaItem.length > 0 ? `Selected ${selectedCaItem.length}` : ''}`;

            return (<a onClick={() => this.setState({ showmore: !this.state.showmore })}><Icon type={icon} style={{ marginRight: '5px' }} />{text}</a>)
        }
        else {
            return false;
        }
    };

    getDataMarketTotal = () => {
        const { data, selectedCaItem, kioskOnlyMode } = this.props;
        const marketData = this.props.branchPCAMode ? data[5] : data[1];

        if (kioskOnlyMode) {
            return _.filter(marketData, { LinkCode: kioskOnlyMode.Code });
        }
        else {
            return _.filter(marketData, o => !_.isEmpty(_.find(selectedCaItem, { Code: o.EmpCode })));
        }
        // return _.orderBy(_.filter(data[1], o => !_.isEmpty(_.find(selectedCaItem, { Code: o.EmpCode }))), ["MarketCode", "CAID"]);
    }

    onRowClassName = (record, index) => {
        const { selectedItem } = this.props;
        if (selectedItem.BranchType != "K" && record.BranchType == "K" && record.No < 2) {
            return styles['hilight-kiosk'];
        }
    }

    onRowMarketClassName = (record, index) => {
        const { marketOver } = this.props;
        if (marketOver) {
            if (marketOver.item.MarketCode == record.MarketCode) {
                // const coord = document.getElementById(record.MarketCode).getBoundingClientRect();

                // this.refs.scroll.scrollbar.setPosition(0,coord.y);

                document.getElementById(record.MarketCode).scrollIntoView({ block: 'start', behavior: 'smooth' });
                return styles['hilight-market'];
            }
        }
    }

    render() {

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0 10px',
                    width: '100%',
                    height: '100%'
                }}>
                <div style={{
                    marginBottom: '10px'
                }}>
                    <Table
                        key="TableBranch"
                        className={styles['table-direction-body-padding']}
                        size="small"
                        rowClassName={this.onRowClassName}
                        pagination={false}
                        columns={this.getcolumnsBranchCA()}
                        dataSource={this.getDataBranchTotal()}
                        footer={this.getFooterBranchTotal} />
                </div>
                <div
                    className={styles['custom-scroll']}
                    style={{
                        flex: '1',
                        overflow: 'auto'
                    }}>
                    <Table
                        key="TableMarket"
                        className={styles['table-direction-body-padding']}
                        size="small"
                        pagination={false}
                        rowClassName={this.onRowMarketClassName}
                        columns={this.getcolumnsMarketCA()}
                        dataSource={this.getDataMarketTotal()}
                        onRow={(record) => ({ id: record.MarketCode })} />
                </div>
            </div>
        )
    }
}


export default CaDirectionProfile

// class ScrollToDelta extends ScrollbarPlugin {
//   static pluginName = 'scrollToDelta';

// onInit()
// {
//     console.log(this.props,"Scroll&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
// }
// }