import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    Tooltip,
    Table,
    Checkbox,
    Badge,
    Popover,
    Switch,
    Icon,
    Input,
    Button,
    Popconfirm,
    message,
    Skeleton
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

import {
    insertBranchDirectionNote,
    updateBranchDirectionNote,
    deleteBranchDirectionNote,
} from '../actions/nanomaster'

// SmoothScrollbar.use(ScrollToDelta);

import moment from 'moment'
import CustomPopOver from './CustomPopover'

const { TextArea } = Input;

const numberWithCommas = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

const definitelyNaN = val => (isNaN(parseFloat(val)) ? Number(val) : parseFloat(val));

const CustomLabel = props => {
    const { viewBox: { cx, cy }, value } = props

    return (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
            <tspan alignmentBaseline="middle" fontSize="14">{`${parseFloat(value).toFixed(0)}%`}</tspan>
        </text>
    );
}

const MarketDPDTitle = (<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
    <Icon type="dollar" style={{ fontSize: '16px', marginRight: '5px', color: '#4CAF50' }} />
    <span style={{ fontSize: '12px' }}>Dynamic Collection Success Rate</span>
</div>);

class AssignmentTooltip extends Component {
    render() {
        const { active, payload } = this.props
        if (active) {
            const { payload, label, coordinate } = this.props
            return (
                <div key={`${label}_${coordinate.x}_${coordinate.y}`} className={styles['custom-tooltip']}>
                    <span>{payload[0].name}</span>
                    <span>{payload[0].value} Cust.</span>
                </div>
            )
        }
        else {
            return <div></div>
        }
    }
}

class TextAreaNoteComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
    }

    onTextAreaChange = e => {
        const { value } = e.target;
        this.setState({ value });
    }

    componentDidUpdate(prevProps) {
        const { NANO_BRANCH_DIRECTION_NOTE_STATUS: { ID, isSaveNote, text, isSuccess } } = this.props;

        const prevID = prevProps.NANO_BRANCH_DIRECTION_NOTE_STATUS.ID;
        const newID = ID;

        if (ID != newID) {
            if (!isSaveNote && isSuccess && text) {
                message.success(text);
            }

            if (!isSaveNote && !isSuccess && text) {
                message.error(text);
            }

            if (isSaveNote && !isSuccess && text) {
                message.info(text);
            }
        }
    }

    componentDidMount() {
        const { NANO_BRANCH_DIRECTION_NOTE_DATA, row, NANO_BRANCH_DIRECTION_NOTE_STATUS: { isSaveNote } } = this.props;

        const NoteCaInMarket = _.find(NANO_BRANCH_DIRECTION_NOTE_DATA, { EmployeeCode: row.EmpCode, MarketCode: row.MarketCode });

        let Note = '';

        if (!_.isEmpty(NoteCaInMarket)) {
            Note = NoteCaInMarket.Note

            this.setState({ value: Note });
        }
    }

    render() {
        const { NANO_BRANCH_DIRECTION_NOTE_DATA, row, NANO_BRANCH_DIRECTION_NOTE_STATUS: { isSaveNote } } = this.props;

        const NoteCaInMarket = _.find(NANO_BRANCH_DIRECTION_NOTE_DATA, { EmployeeCode: row.EmpCode, MarketCode: row.MarketCode });

        let Note = '';

        if (!_.isEmpty(NoteCaInMarket)) {
            Note = NoteCaInMarket.Note
        }

        if (isSaveNote) {
            return (<div style={{ margin: '-7px -11px', width: '250px' }}><Skeleton active size="small" /></div >)
        }
        else {
            return (
                <div style={{ margin: '-7px -11px', width: '250px' }}>
                    <TextArea size="small" placeholder="Note" defaultValue={this.state.value} value={this.state.value} onChange={this.onTextAreaChange} autosize={{ minRows: 3, maxRows: 3 }} maxlength="200" />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                        <span>{`${this.state.value.length}/200`}</span>
                        <div>
                            {
                                Note &&
                                <Popconfirm title="คุณต้องการลบโน๊ตนี้ใช้หรือไม่" onConfirm={() => this.props.onDeleteNote(NoteCaInMarket)}>
                                    <Button style={{ marginRight: '7px' }} loading={isSaveNote} shape="circle" type="danger" icon="delete" />
                                </Popconfirm>
                            }
                            <Button type="primary" loading={isSaveNote} icon="edit" size="small" disabled={this.state.value.length <= 0} onClick={() => this.props.onClick(this.state.value, NoteCaInMarket)}>Update</Button>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
const TextAreaNote = connect((state) => ({
    NANO_BRANCH_DIRECTION_NOTE_DATA: state.NANO_BRANCH_DIRECTION_NOTE_DATA,
    NANO_BRANCH_DIRECTION_NOTE_STATUS: state.NANO_BRANCH_DIRECTION_NOTE_STATUS
}), {}
)(TextAreaNoteComponent)

class CaDirectionProfile extends Component {

    state = {
        showmore: false,
        MarketSuccessRateMode: false,
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

        let resultColumn = [{
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
            width: '32px',
            align: 'center',
            className: `blacklight-column ${styles['td-vertical-middle']} th-bottom`,
            render: (value, row, index) => {
                return <span className={styles['color-soft']}>{value}</span>
            }
        }, {
            dataIndex: 'TotalPercent',
            colSpan: 0,
            align: 'center',
            width: '35px',
            className: `${styles['td-vertical-middle']}`,
            render: (value, row, index) => {
                if (value != 0) {
                    if (isPopup) {
                        return <span onDoubleClick={this.handleDblClickOfBranchJumper.bind(this, { data: row, cycle: '', IsAssign: this.props.branchPCAMode })} className={`${styles['align-right-text']} ${styles['hover-link']} ${styles['hover-linkBranch2']}`}>{parseFloat(value).toFixed(0)}%</span>
                    }
                    else {
                        return <CustomPopOver
                            trigger="click"
                            title={MarketDPDTitle}
                            content={this.getMarketDPDTable(value, row, index, null, 'BC', this.props.branchPCAMode)}>
                            <span onDoubleClick={this.handleDblClickOfBranchJumper.bind(this, { data: row, cycle: '', IsAssign: this.props.branchPCAMode })} className={`${styles['align-right-text']} ${styles['mini-font']} ${styles['hover-link']} ${styles['hover-linkBranch2']}`}>{parseFloat(value).toFixed(0)}%</span>
                        </CustomPopOver>
                    }
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
                    if (isPopup) {
                        return (<span>{value}</span>)
                    }
                    else {
                        return <CustomPopOver
                            trigger="click"
                            title={MarketDPDTitle}
                            content={this.getMarketDPDTable(value, row, index, 'Mon', 'BCD', this.props.branchPCAMode)}>
                            <div onDoubleClick={this.handleDblClickOfBranchJumper.bind(this, { data: row, cycle: 'Mon', IsAssign: this.props.branchPCAMode })} className={`${styles['mini-font']} ${styles['hover-link']} ${styles['hover-linkBranchDay']}`}>{value}</div>
                        </CustomPopOver>
                    }
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
                    if (isPopup) {
                        return (<span>{value}</span>)
                    }
                    else {
                        return <CustomPopOver
                            trigger="click"
                            title={MarketDPDTitle}
                            content={this.getMarketDPDTable(value, row, index, 'Tue', 'BCD', this.props.branchPCAMode)}>
                            <div onDoubleClick={this.handleDblClickOfBranchJumper.bind(this, { data: row, cycle: 'Tue', IsAssign: this.props.branchPCAMode })} className={`${styles['mini-font']} ${styles['hover-link']} ${styles['hover-linkBranchDay']}`}>{value}</div>
                        </CustomPopOver>
                    }
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
                    if (isPopup) {
                        return (<span>{value}</span>)
                    }
                    else {
                        return <CustomPopOver
                            trigger="click"
                            title={MarketDPDTitle}
                            content={this.getMarketDPDTable(value, row, index, 'Wed', 'BCD', this.props.branchPCAMode)}>
                            <div onDoubleClick={this.handleDblClickOfBranchJumper.bind(this, { data: row, cycle: 'Wed', IsAssign: this.props.branchPCAMode })} className={`${styles['mini-font']} ${styles['hover-link']} ${styles['hover-linkBranchDay']}`}>{value}</div>
                        </CustomPopOver>
                    }
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
                    if (isPopup) {
                        return (<span>{value}</span>)
                    }
                    else {
                        return <CustomPopOver
                            trigger="click"
                            title={MarketDPDTitle}
                            content={this.getMarketDPDTable(value, row, index, 'Thu', 'BCD', this.props.branchPCAMode)}>
                            <div onDoubleClick={this.handleDblClickOfBranchJumper.bind(this, { data: row, cycle: 'Thu', IsAssign: this.props.branchPCAMode })} className={`${styles['mini-font']} ${styles['hover-link']} ${styles['hover-linkBranchDay']}`}>{value}</div>
                        </CustomPopOver>
                    }
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
                    if (isPopup) {
                        return (<span>{value}</span>)
                    }
                    else {
                        return <CustomPopOver
                            trigger="click"
                            title={MarketDPDTitle}
                            content={this.getMarketDPDTable(value, row, index, 'Fri', 'BCD', this.props.branchPCAMode)}>
                            <div onDoubleClick={this.handleDblClickOfBranchJumper.bind(this, { data: row, cycle: 'Fri', IsAssign: this.props.branchPCAMode })} className={`${styles['mini-font']} ${styles['hover-link']} ${styles['hover-linkBranchDay']}`}>{value}</div>
                        </CustomPopOver>
                    }
                }
            }
        }
        ];

        if (!isPopup) {
            resultColumn.splice(2, 0, {
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
                render: (value, row, index) => {
                    if (value != 0) {
                        return <CustomPopOver
                            trigger="click"
                            title={MarketDPDTitle}
                            content={this.getMarketDPDTable(value, row, index, null, 'BC', this.props.branchPCAMode)}>
                            <span onDoubleClick={this.handleDblClickOfBranchJumper.bind(this, { data: row, cycle: '', IsAssign: this.props.branchPCAMode })} className={`${styles['align-right-text']}  ${styles['mini-font']} ${styles['hover-link']} ${styles['hover-linkBranch1']}`}>{value}</span>
                        </CustomPopOver>
                    }
                }
            })
        }

        return resultColumn;
    }

    getImageAddNote = (row, borderColor, CanEditNote) => (CanEditNote ?
        <Popover trigger="click" destroyOnClose={true} content={<TextAreaNote row={row} onDeleteNote={NoteCaInMarket => this.DeleteNote(row, NoteCaInMarket)} onClick={(value, NoteCaInMarket) => this.InsertOrUpdateNote(row, value, NoteCaInMarket)} />}>
            <div
                className={styles['market-ca-note']}
                style={{
                    position: 'relative'
                }}>
                <img className={styles['ca-mini-img']} style={{ border: borderColor && `3px solid ${borderColor}` }} src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${row.EmpCode}`} />
                <div className="icon-note">
                    <Icon type="form" />
                </div>
            </div>
        </Popover>
        :
        <img className={styles['ca-mini-img']} style={{ border: borderColor && `3px solid ${borderColor}` }} src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${row.EmpCode}`} />
    )

    DeleteNote = (row, NoteCaInMarket) => {
        const { deleteBranchDirectionNote, AUTH_NANO_USER } = this.props;

        const CreateEmp = !_.isEmpty(AUTH_NANO_USER) ? this.props.AUTH_NANO_USER.EmployeeCode : '';

        deleteBranchDirectionNote({ SysNO: NoteCaInMarket.SysNO, UpdatedBy: CreateEmp });
    }

    InsertOrUpdateNote = (row, value, NoteCaInMarket) => {
        const { insertBranchDirectionNote, updateBranchDirectionNote, AUTH_NANO_USER } = this.props;

        const CreateEmp = !_.isEmpty(AUTH_NANO_USER) ? this.props.AUTH_NANO_USER.EmployeeCode : '';

        if (!_.isEmpty(NoteCaInMarket)) {
            let param = {
                SysNO: NoteCaInMarket.SysNO,
                Note: value,
                UpdatedBy: CreateEmp
            }

            updateBranchDirectionNote(param);
        }
        else {
            let param = {
                BranchCode: row.LinkCode.slice(0, 3),
                KioskCode: row.LinkCode.slice(3, 6),
                OriginBranchCode: row.LinkCode.slice(0, 3),
                MarketCode: row.MarketCode,
                EmployeeCode: row.EmpCode,
                Note: value,
                CreatedBy: CreateEmp
            }

            insertBranchDirectionNote(param);
        }
    }

    getcolumnsMarketCA = () => {
        const titleSuccessRateMode = this.state.MarketSuccessRateMode ? "Collection Mode" : "% Success Mode";
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
                            <Tooltip title={(<div><span>{value}</span><p /><span>{`MKT Potential ${row.Potential} (${definitelyNaN(row.PotAch).toFixed(0)}%)`}</span></div>)} placement="top" >
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
                    <Tooltip title={titleSuccessRateMode}><Switch className={styles['mini-slide']} size="small" onChange={value => this.setState({ MarketSuccessRateMode: value })} /></Tooltip>
                ),
                dataIndex: 'Total',
                width: '30px',
                align: 'center',
                className: `blacklight-column ${styles['margin-top-td']}`,
                render: (value, row, index) => {
                    const data = this.getDataMarketTotal();

                    // const sumTotalByMarket = _.sumBy(_.filter(data, { MarketCode: row.MarketCode }), "Total");

                    const obj = {
                        children: (<CustomPopOver
                            trigger="click"
                            title={MarketDPDTitle}
                            content={this.getMarketDPDTable(value, row, index, null, 'M', this.props.branchPCAMode)}>
                            <span onDoubleClick={this.handleDblClickOfMktJumper.bind(this, { data: row, mode: 1, cycle: '', IsAssign: this.props.branchPCAMode })} className={`${styles['color-soft']} ${styles['mini-font']} ${styles['hover-link']} ${styles['hover-linkMarket1']}`}>{this.state.MarketSuccessRateMode ? `${definitelyNaN(value).toFixed(0)}%` : value}</span>
                        </CustomPopOver>),
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
                width: '36px',
                className: styles['td-vertical-middle'],
                render: (value, row, index) => {
                    let dataAssign = _.filter(this.props.data[3], { MarketCode: row.MarketCode, OwnerCode: row.EmpCode });
                    const { NANO_BRANCH_DIRECTION_NOTE_DATA } = this.props;
                    const NoteCaInMarket = _.find(NANO_BRANCH_DIRECTION_NOTE_DATA, { EmployeeCode: row.EmpCode, MarketCode: row.MarketCode });

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
                                <div className={styles['assign-detail-ca']} style={{ minWidth: '230px' }}>
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
                                            <div style={{ justifyContent: 'center', alignItems: 'center', maxHeight: '80px', width: '80px' }}>
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
                                        dataAssign.length > 0 &&
                                        <Table
                                            className={styles['table-direction-body-padding']}
                                            size="small"
                                            showHeader={false}
                                            style={{ width: '300px', marginBottom: '7px' }}
                                            pagination={false}
                                            columns={this.getcolumnsBranchCA(true)}
                                            dataSource={dataAssign} />
                                    }
                                    {
                                        !_.isEmpty(NoteCaInMarket) &&
                                        <div style={{ fontSize: '12px', minWidth: '225px', maxWidth: '300px', wordWrap: 'break-word' }}>
                                            <p>{`${row.MarketName}`}</p>
                                            <p>{`By: ${NoteCaInMarket.UpdatedByName || NoteCaInMarket.CreatedByName} Update: ${moment(NoteCaInMarket.UpdatedDate || NoteCaInMarket.CreatedDate).utc().format("DD-MM-YY HH:mm")}`}</p>
                                            <p>{`${NoteCaInMarket.Note}`}</p>
                                        </div>
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
                                            {
                                                this.getImageAddNote(row, borderColor, true)
                                            }
                                        </Badge>
                                        :
                                        this.getImageAddNote(row, borderColor, true)
                                }
                            </div>
                        </CustomPopOver>
                    )
                }
            }, {
                dataIndex: 'TotalPercent',
                colSpan: 0,
                align: 'center',
                width: '34px',
                className: styles['td-vertical-middle'],
                render: (value, row, index) => {
                    if (value != null) {
                        if (this.state.MarketSuccessRateMode) {
                            return <CustomPopOver
                                trigger="click"
                                title={MarketDPDTitle}
                                content={this.getMarketDPDTable(value, row, index, null, 'MC', this.props.branchPCAMode)}>
                                <span onDoubleClick={this.handleDblClickOfMktJumper.bind(this, { data: row, mode: 2, cycle: '', IsAssign: this.props.branchPCAMode })} className={`${styles['align-right-text']} ${styles['mini-font']} ${styles['hover-link']} ${styles['hover-linkMarket2']}`}>{parseFloat(value).toFixed(0)}%</span>
                            </CustomPopOver>
                        }
                        else {
                            if (value > 0) {
                                return <CustomPopOver
                                    trigger="click"
                                    title={MarketDPDTitle}
                                    content={this.getMarketDPDTable(value, row, index, null, 'MC', this.props.branchPCAMode)}>
                                    <span onDoubleClick={this.handleDblClickOfMktJumper.bind(this, { data: row, mode: 2, cycle: '', IsAssign: this.props.branchPCAMode })} className={`${styles['align-right-text']} ${styles['mini-font']} ${styles['hover-link']} ${styles['hover-linkMarket2']}`}>{parseFloat(value).toFixed(0)}%</span>
                                </CustomPopOver>
                            }
                        }
                    }
                }
            }, {
                title: 'M',
                dataIndex: 'Mon',
                align: 'center',
                width: '35px',
                className: `Mon ${styles['td-vertical-middle']}`,
                render: (value, row, index) => {
                    if (value != null) {
                        if (this.state.MarketSuccessRateMode) {

                            return <CustomPopOver
                                trigger="click"
                                title={MarketDPDTitle}
                                content={this.getMarketDPDTable(value, row, index, 'Mon', 'MCD', this.props.branchPCAMode)}>
                                <div onDoubleClick={this.handleDblClickOfMktJumper.bind(this, { data: row, mode: 3, cycle: 'Mon', IsAssign: this.props.branchPCAMode })} className={`${styles['go-market']} ${row.Mon_Miss == 0 && styles['no-go-market']} ${styles['mini-font']} ${styles['hover-link']}`}>{this.state.MarketSuccessRateMode ? `${definitelyNaN(value).toFixed(0)}%` : value}</div>
                            </CustomPopOver>
                        }
                        else {
                            if (value != 0) {
                                return <CustomPopOver
                                    trigger="click"
                                    title={MarketDPDTitle}
                                    content={this.getMarketDPDTable(value, row, index, 'Mon', 'MCD', this.props.branchPCAMode)}>
                                    <div onDoubleClick={this.handleDblClickOfMktJumper.bind(this, { data: row, mode: 3, cycle: 'Mon', IsAssign: this.props.branchPCAMode })} className={`${styles['go-market']} ${row.Mon_Miss == 0 && styles['no-go-market']} ${styles['mini-font']} ${styles['hover-link']}`}>{this.state.MarketSuccessRateMode ? `${definitelyNaN(value).toFixed(0)}%` : value}</div>
                                </CustomPopOver>
                            }
                        }
                    }
                }
            }, {
                title: 'T',
                dataIndex: 'Tue',
                align: 'center',
                width: '35px',
                className: `Tue ${styles['td-vertical-middle']}`,
                render: (value, row, index) => {
                    if (value != null) {
                        if (this.state.MarketSuccessRateMode) {
                            return <CustomPopOver
                                trigger="click"
                                title={MarketDPDTitle}
                                content={this.getMarketDPDTable(value, row, index, 'Tue', 'MCD', this.props.branchPCAMode)}>
                                <div onDoubleClick={this.handleDblClickOfMktJumper.bind(this, { data: row, mode: 3, cycle: 'Tue', IsAssign: this.props.branchPCAMode })} className={`${styles['go-market']} ${row.Tue_Miss == 0 && styles['no-go-market']} ${styles['mini-font']} ${styles['hover-link']}`}>{this.state.MarketSuccessRateMode ? `${definitelyNaN(value).toFixed(0)}%` : value}</div>
                            </CustomPopOver>
                        }
                        else {
                            if (value != 0) {
                                return <CustomPopOver
                                    trigger="click"
                                    title={MarketDPDTitle}
                                    content={this.getMarketDPDTable(value, row, index, 'Tue', 'MCD', this.props.branchPCAMode)}>
                                    <div onDoubleClick={this.handleDblClickOfMktJumper.bind(this, { data: row, mode: 3, cycle: 'Tue', IsAssign: this.props.branchPCAMode })} className={`${styles['go-market']} ${row.Tue_Miss == 0 && styles['no-go-market']} ${styles['mini-font']} ${styles['hover-link']}`}>{this.state.MarketSuccessRateMode ? `${definitelyNaN(value).toFixed(0)}%` : value}</div>
                                </CustomPopOver>
                            }
                        }
                    }
                }
            }, {
                title: 'W',
                dataIndex: 'Wed',
                align: 'center',
                width: '35px',
                className: `Wed ${styles['td-vertical-middle']}`,
                render: (value, row, index) => {
                    if (value != null) {
                        if (this.state.MarketSuccessRateMode) {
                            return <CustomPopOver
                                trigger="click"
                                title={MarketDPDTitle}
                                content={this.getMarketDPDTable(value, row, index, 'Wed', 'MCD', this.props.branchPCAMode)}>
                                <div onDoubleClick={this.handleDblClickOfMktJumper.bind(this, { data: row, mode: 3, cycle: 'Wed', IsAssign: this.props.branchPCAMode })} className={`${styles['go-market']} ${row.Wed_Miss == 0 && styles['no-go-market']} ${styles['mini-font']} ${styles['hover-link']}`}>{this.state.MarketSuccessRateMode ? `${definitelyNaN(value).toFixed(0)}%` : value}</div>
                            </CustomPopOver>
                        }
                        else {
                            if (value != 0) {
                                return <CustomPopOver
                                    trigger="click"
                                    title={MarketDPDTitle}
                                    content={this.getMarketDPDTable(value, row, index, 'Wed', 'MCD', this.props.branchPCAMode)}>
                                    <div onDoubleClick={this.handleDblClickOfMktJumper.bind(this, { data: row, mode: 3, cycle: 'Wed', IsAssign: this.props.branchPCAMode })} className={`${styles['go-market']} ${row.Wed_Miss == 0 && styles['no-go-market']} ${styles['mini-font']} ${styles['hover-link']}`}>{this.state.MarketSuccessRateMode ? `${definitelyNaN(value).toFixed(0)}%` : value}</div>
                                </CustomPopOver>
                            }
                        }
                    }
                }
            }, {
                title: 'Th',
                dataIndex: 'Thu',
                align: 'center',
                width: '35px',
                className: `Thu ${styles['td-vertical-middle']}`,
                render: (value, row, index) => {
                    if (value != null) {
                        if (this.state.MarketSuccessRateMode) {
                            return <CustomPopOver
                                trigger="click"
                                title={MarketDPDTitle}
                                content={this.getMarketDPDTable(value, row, index, 'Thu', 'MCD', this.props.branchPCAMode)}>
                                <div onDoubleClick={this.handleDblClickOfMktJumper.bind(this, { data: row, mode: 3, cycle: 'Thu', IsAssign: this.props.branchPCAMode })} className={`${styles['go-market']} ${row.Thu_Miss == 0 && styles['no-go-market']} ${styles['mini-font']} ${styles['hover-link']}`}>{this.state.MarketSuccessRateMode ? `${definitelyNaN(value).toFixed(0)}%` : value}</div>
                            </CustomPopOver>
                        }
                        else {
                            if (value != 0) {
                                return <CustomPopOver
                                    trigger="click"
                                    title={MarketDPDTitle}
                                    content={this.getMarketDPDTable(value, row, index, 'Thu', 'MCD', this.props.branchPCAMode)}>
                                    <div onDoubleClick={this.handleDblClickOfMktJumper.bind(this, { data: row, mode: 3, cycle: 'Thu', IsAssign: this.props.branchPCAMode })} className={`${styles['go-market']} ${row.Thu_Miss == 0 && styles['no-go-market']} ${styles['mini-font']} ${styles['hover-link']}`}>{this.state.MarketSuccessRateMode ? `${definitelyNaN(value).toFixed(0)}%` : value}</div>
                                </CustomPopOver>
                            }
                        }
                    }
                }
            }, {
                title: 'F',
                dataIndex: 'Fri',
                align: 'center',
                width: '35px',
                className: `Fri ${styles['td-vertical-middle']}`,
                render: (value, row, index) => {
                    if (value != null) {
                        if (this.state.MarketSuccessRateMode) {
                            return <CustomPopOver
                                trigger="click"
                                title={MarketDPDTitle}
                                content={this.getMarketDPDTable(value, row, index, 'Fri', 'MCD', this.props.branchPCAMode)}>
                                <div onDoubleClick={this.handleDblClickOfMktJumper.bind(this, { data: row, mode: 3, cycle: 'Fri', IsAssign: this.props.branchPCAMode })} className={`${styles['go-market']} ${row.Fri_Miss == 0 && styles['no-go-market']} ${styles['mini-font']} ${styles['hover-link']}`}>{this.state.MarketSuccessRateMode ? `${definitelyNaN(value).toFixed(0)}%` : value}</div>
                            </CustomPopOver>
                        }
                        else {
                            if (value != 0) {
                                return <CustomPopOver
                                    trigger="click"
                                    title={MarketDPDTitle}
                                    content={this.getMarketDPDTable(value, row, index, 'Fri', 'MCD', this.props.branchPCAMode)}>
                                    <div onDoubleClick={this.handleDblClickOfMktJumper.bind(this, { data: row, mode: 3, cycle: 'Fri', IsAssign: this.props.branchPCAMode })} className={`${styles['go-market']} ${row.Fri_Miss == 0 && styles['no-go-market']} ${styles['mini-font']} ${styles['hover-link']}`}>{this.state.MarketSuccessRateMode ? `${definitelyNaN(value).toFixed(0)}%` : value}</div>
                                </CustomPopOver>
                            }
                        }
                    }
                }
            }
        ])
    };

    getMarketDPDTable = (value, row, index, clickdate, type, assignMode) => {
        return (
            <div>
                {/* <span>{JSON.stringify(this.getDataMarketDPD(value, row, index, clickdate, type))}</span> */}
                <Table
                    rowKey="SeqNode"
                    className={styles['table-direction-body-padding']}
                    style={{ width: '300px' }}
                    size="small"
                    bordered={true}
                    pagination={false}
                    rowClassName={this.onRowMarketDPDClassName}
                    columns={this.getcolumnsMarketDPD(value, row, index, clickdate, type, assignMode)}
                    dataSource={this.getDataMarketDPD(value, row, index, clickdate, type, assignMode)}
                    onRow={(record) => ({ id: record.SeqNode })}
                    defaultExpandedRowKeys={['3', '3.1']} />
            </div>
        )
    }

    getcolumnsMarketDPD = (value, row, index, clickdate, type, assignMode) => ([
        {
            title: (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <span>Collection KPI</span>
                </div>
            ),
            dataIndex: 'Title',
            key: `Title_${Math.random}`,
            className: styles['td-vertical-middle'],
            width: '80px',
            render: (text, record, index) => {
                const showPercent = ['3', '3.1', '3.2', '4', '5', '6']

                const { data } = this.props;

                let filterData = [];
                switch (type) {
                    case 'BC':
                        filterData = _.filter(data[6], o => o.Code == row.Code && _.isEmpty(o.Days));
                        break;
                    case 'BCD':
                        filterData = _.filter(data[6], o => o.Code == row.Code && o.Days == clickdate);
                        break;
                    case 'M':
                        filterData = _.filter(data[7], o => o.MktCode == row.MarketCode && _.isEmpty(o.Code) && _.isEmpty(o.Days));
                        break;
                    case 'MC':
                        filterData = _.filter(data[7], o => o.MktCode == row.MarketCode && o.Code == row.EmpCode && _.isEmpty(o.Days));
                        break;
                    case 'MCD':
                        filterData = _.filter(data[7], o => o.MktCode == row.MarketCode && o.Code == row.EmpCode && o.Days == clickdate);
                        break;
                }

                let Percent = '';
                const isShowPercent = _.find(showPercent, o => o == record.SeqNode);

                if (isShowPercent) {
                    switch (record.SeqNode) {
                        case '3':
                        case '3.1':
                        case '3.2':
                        case '4':
                        case '5':
                        case '6':
                            const TotalBuckets = _.find(filterData, { SeqNode: '2' });
                            if (!_.isEmpty(TotalBuckets)) {
                                Percent = `${(parseFloat(record.TotalCust) / parseFloat(TotalBuckets.TotalCust) * 100.0).toFixed(1)}%`
                            }
                            break;
                    }
                }

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
                        <span className={styles['text-ellipsis']}>{`${text} ${Percent}`}</span>
                    </div>
                )
            }
        },
        {
            title: (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <span>Total</span>
                    <span>Cust.</span>
                </div>
            ),
            dataIndex: 'TotalCust',
            key: `TotalCust_${Math.random}`,
            className: styles['td-vertical-bottom'],
            render: (text, record, index) => {
                console.log(text, record)
                return (<Tooltip title={
                    (<span style={{ fontSize: '11px' }}>{`#Paid ${record.TotalPaid} ${record.SelfPaid > 0 ? `(จ่ายเอง ${record.SelfPaid})` : ''}`}</span>)
                }>
                    <span onDoubleClick={() => this.handleDblClickOfMktCycleJumper(record, { type: type, rowsData: row, wkday: clickdate, assign: assignMode, isPaid: null })} className={`${styles['align-center-text']} ${styles['hover-link']} ${styles['hover-linkBranchPopOver']}`} >{text}</span>
                </Tooltip>)
            }
        }, {
            title: (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <span>%</span>
                    <span>Succ.</span>
                </div>
            ),
            dataIndex: 'PercentSuccess',
            key: `PercentSuccess_${Math.random}`,
            className: styles['td-vertical-bottom'],
            render: (text, record, index) => {
                return (<Tooltip title={
                    (<span style={{ fontSize: '11px' }}>{`Succ. ตามวัน Due ${parseFloat(record.DueSucc).toFixed(0)}%`}</span>)
                }>
                    <span onDoubleClick={() => this.handleDblClickOfMktCycleJumper(record, { type: type, rowsData: row, wkday: clickdate, assign: assignMode, isPaid: 'Paid' })} className={`${styles['align-center-text']} ${styles['hover-link']} ${styles['hover-linkBranchPopOver']}`}>{parseFloat(text).toFixed(0)}%</span>
                </Tooltip>)
            }
        }, {
            title: (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <span>#Not</span>
                    <span>Paid</span>
                </div>
            ),
            dataIndex: 'Unpaid',
            key: `Unpaid_${Math.random}`,
            className: styles['td-vertical-bottom'],
            render: (text, record, index) => {
                return (<span onDoubleClick={() => this.handleDblClickOfMktCycleJumper(record, { type: type, rowsData: row, wkday: clickdate, assign: assignMode, isPaid: 'Unpaid' })} className={`${styles['align-center-text']} ${styles['hover-link']} ${styles['hover-linkBranchPopOver']}`}>{text}</span>)
            }
        }, {
            title: (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <span>$</span>
                    <span>Paid</span>
                </div>
            ),
            dataIndex: 'PaidAmount',
            key: `PaidAmount_${Math.random}`,
            className: styles['td-vertical-bottom'],
            render: (text, record, index) => {
                return (<span className={styles['align-right-text']}>{numberWithCommas(text)}</span>)
            }
        }
    ]);

    getDataMarketDPD = (value, row, index, clickdate, type, assignMode) => {

        const { data } = this.props;

        // const dataItem = data[6];
        let filterData = [];
        let result = [];
        const rootLevel = 6;

        //Branch EmpCode = Code
        //Mareket EmpCode = EmpCode

        switch (type) {
            case 'BC':
                filterData = _.filter(this.props.branchPCAMode ? data[10] : data[6], o => o.Code == row.Code && _.isEmpty(o.Days));
                break;
            case 'BCD':
                filterData = _.filter(this.props.branchPCAMode ? data[10] : data[6], o => o.Code == row.Code && o.Days == clickdate);
                break;
            case 'M':
                filterData = _.filter(this.props.branchPCAMode ? data[11] : data[7], o => o.MktCode == row.MarketCode && _.isEmpty(o.Code) && _.isEmpty(o.Days));
                break;
            case 'MC':
                filterData = _.filter(this.props.branchPCAMode ? data[11] : data[7], o => o.MktCode == row.MarketCode && o.Code == row.EmpCode && _.isEmpty(o.Days));
                break;
            case 'MCD':
                filterData = _.filter(this.props.branchPCAMode ? data[11] : data[7], o => o.MktCode == row.MarketCode && o.Code == row.EmpCode && o.Days == clickdate);
                break;
        }

        if (!_.isEmpty(filterData)) {

            for (let i = 1; i <= rootLevel; i++) {
                let rootData = _.orderBy(filterData, "SeqNo");
                let level = i;
                let output = null;

                output = this.getRootItemDataMarketDPD(rootData, `${level}`);

                if (output) {
                    result.push(output)
                }
            }
        }

        // if (!_.isEmpty(filterData)) {
        //     result = _.orderBy(filterData, "SeqNo").map((item, index) => ({
        //         Level: item.SeqNode,
        //         Title: item.CollectionName,
        //         TotalCust: item.Totalcust,
        //         PercentSuccess: (parseFloat(item.Collect) / parseFloat(item.Totalcust)) * 100.00,
        //         Unpaid: item.Totalcust - item.Collect,
        //         PaidAmount: item.Amt,
        //         children: this.getDataMarketDPD(value, row, index, clickdate, type, `${item.SeqNode}.`)
        //     }));
        // }

        return result;
    }

    getRootItemDataMarketDPD = (filterData, level) => {
        let root = _.find(filterData, { SeqNode: `${level}` });
        let result = null;

        if (!_.isEmpty(root)) {
            result = {
                SeqNode: level,
                RowKey: root.RowKey,
                Level: root.SeqNode.split('.').join(''),
                Title: root.CollectionName,
                TotalCust: root.TotalCust,
                PercentSuccess: root.Succ,
                Collect: root.Collect,
                Unpaid: root.Unpaid,
                PaidAmount: root.LstPmtAmt,
                TotalPaid: root.TotalPaid,
                SelfPaid: root.SelfPaid,
                DueSucc: root.DueSucc
            }

            const childLevel = `${level}.`;
            const countChildLevel = _.filter(childLevel, f => f == '.').length;
            const filterChild = _.filter(filterData, o => o.SeqNode.slice(0, childLevel.length) == childLevel && _.filter(o.SeqNode, f => f == '.').length == countChildLevel);

            if (filterChild.length > 0) {
                result.children = null;
                _.forEach(filterChild, (item, index) => {
                    if (!result.children) {
                        result.children = [];
                    }

                    const childData = this.getRootItemDataMarketDPD(filterData, `${item.SeqNode}`);

                    if (childData) {
                        result.children.push(childData);
                    }
                })
            }
        }

        return result;
    }

    onRowMarketDPDClassName = (record, index) => {

        const style = styles[`hilight-level-${record.Level}`];
        if (style) {
            return styles[`hilight-level-${record.Level}`];
        }
        else {
            return styles['hilight-level-1']
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
            var orderCaData = _.filter(BranchData, o => o.No == 2).map(item => {
                switch (item.PositionCode) {
                    case 'CA':
                        item.Seq = 1;
                        break;
                    case 'KCA':
                        item.Seq = 2;
                        break;
                    case 'PCA':
                        item.Seq = 3;
                        break;
                    case 'FCR':
                        item.Seq = 4;
                        break;
                }

                return item
            })
            CaBranchData = _.orderBy(orderCaData, "Seq");

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
        const marketData = this.state.MarketSuccessRateMode ? data[8] : this.props.branchPCAMode ? data[5] : data[1];

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
                    padding: '0px 0px 0px 5px',
                    width: '100%',
                    height: '100%'
                }}>
                <div
                    className={styles['custom-scroll-white']}
                    style={{
                        marginBottom: '10px',
                        overflowY: 'scroll'
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
                        overflowY: 'scroll'
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

    handleDblClickOfBranchJumper = (params) => {
        const { AUTH_NANO_USER } = this.props

        let assign_mode = (params.IsAssign && params.IsAssign == true) ? '&ASSIGN=Y' : '&ASSIGN=N'

        let user_id = (AUTH_NANO_USER && !_.isEmpty(AUTH_NANO_USER)) ? AUTH_NANO_USER.EmployeeCode : ''
        let brn_code = (params.data && !_.isEmpty(params.data)) ? params.data.LinkCode : ''
        let emp_code = (params.data && !_.isEmpty(params.data)) ? params.data.Code : ''
        let cycle_day = (params.cycle && !_.isEmpty(params.cycle)) ? params.cycle : ''

        let qs_pattern = `?UID=${user_id}`

        if (params.data && !_.isEmpty(params.data)) {
            switch (params.data.PositionCode) {
                case 'CA':
                case 'PCA':
                case 'KCA':
                case 'FCR':
                    qs_pattern += `&BR=${brn_code}&EID=${emp_code}`
                    if (cycle_day && !_.isEmpty(cycle_day)) {
                        qs_pattern += `&DAY=${cycle_day}`
                    }

                    break
                default:
                    qs_pattern += `&BR=${brn_code}`
                    if (cycle_day && !_.isEmpty(cycle_day)) {
                        qs_pattern += `&DAY=${cycle_day}`
                    }
                    break
            }

            this.openNewTab(`${qs_pattern}${assign_mode}`)

        } else {
            Notification.error({
                message: 'Notice System',
                description: 'ขออภัย, เกิดข้อผิดพลาดในการรับข้อมูล โปรดติดต่อผู้ดูแลระบบ เพื่อทำการตรวจสอบ',
            })
        }
    }


    /*
        MODE DESCRIPTION
        WHERE IS A MODE
        1 = MARKET ONLY
        2 = MARKET WITH CA
        3 = DAY
    */
    handleDblClickOfMktJumper = (params) => {
        const { AUTH_NANO_USER } = this.props

        let assign_mode = (params.IsAssign && params.IsAssign == true) ? '&ASSIGN=Y' : '&ASSIGN=N'

        let user_id = (AUTH_NANO_USER && !_.isEmpty(AUTH_NANO_USER)) ? AUTH_NANO_USER.EmployeeCode : ''
        let brn_code = (params.data && !_.isEmpty(params.data)) ? params.data.LinkCode : ''
        let mkt_code = (params.data && !_.isEmpty(params.data)) ? params.data.MarketCode : ''
        let emp_code = (params.data && !_.isEmpty(params.data)) ? params.data.EmpCode : ''
        let cycle_day = (params.cycle && !_.isEmpty(params.cycle)) ? params.cycle : ''

        let qs_pattern = `?UID=${user_id}`
        switch (params.mode) {
            case 1:
                qs_pattern += `&MKT=${mkt_code}`
                break
            case 2:
                qs_pattern += `&MKT=${mkt_code}&EID=${emp_code}`
                break
            default:
                qs_pattern += `&BR=${brn_code}&MKT=${mkt_code}&EID=${emp_code}&DAY=${cycle_day}`
                break
        }

        this.openNewTab(`${qs_pattern}${assign_mode}`)

    }

    handleDblClickOfMktCycleJumper = (params, options) => {
        const { AUTH_NANO_USER } = this.props

        let assign_mode = (options.assign && options.assign == true) ? '&ASSIGN=Y' : '&ASSIGN=N'

        let user_id = (AUTH_NANO_USER && !_.isEmpty(AUTH_NANO_USER)) ? AUTH_NANO_USER.EmployeeCode : ''
        let rows_data = (options && !_.isEmpty(options.rowsData)) ? options.rowsData : null
        let brn_code = (rows_data && !_.isEmpty(rows_data.LinkCode)) ? rows_data.LinkCode : ''
        let emp_code = (rows_data && !_.isEmpty(rows_data.Code)) ? rows_data.Code : ''
        let mkt_code = (rows_data && !_.isEmpty(rows_data.MarketCode)) ? rows_data.MarketCode : ''
        let mkt_emp_code = (rows_data && !_.isEmpty(rows_data.EmpCode)) ? rows_data.EmpCode : ''
        let cycle_day = (options && !_.isEmpty(options.wkday)) ? options.wkday : ''

        /* DEFIND TYPE
        BC: Branch + CA
        BCD: Branch + Day
        M: Market
        MC: Market + CA
        MCD: Market + Ca + Day
        */

        let qs_pattern = `?UID=${user_id}`
        let qs_filters = getFilterCriteria(params.Title, options)
        switch (options.type) {
            case 'BC':
                if (rows_data && !_.isEmpty(rows_data.PositionCode)) {
                    qs_pattern += `&BR=${brn_code}&EID=${emp_code}`
                } else {
                    qs_pattern += `&BR=${brn_code}`
                }
                break;
            case 'BCD':
                if (rows_data && !_.isEmpty(rows_data.PositionCode)) {
                    qs_pattern += `&BR=${brn_code}&EID=${emp_code}&DAY=${cycle_day}`
                } else {
                    qs_pattern += `&BR=${brn_code}&DAY=${cycle_day}`
                }
                break;
            case 'M':
                qs_pattern += `&BR=${brn_code}&MKT=${mkt_code}`
                break;
            case 'MC':
                qs_pattern += `&BR=${brn_code}&MKT=${mkt_code}&EID=${mkt_emp_code}`
                break;
            case 'MCD':
                qs_pattern += `&BR=${brn_code}&MKT=${mkt_code}&EID=${mkt_emp_code}&DAY=${cycle_day}`
                break;
        }

        this.openNewTab(`${qs_pattern}${qs_filters}${assign_mode}`)

    }

    openNewTab = (qs) => {
        let win = window.open(`http://tc001pcis1p/nanolayout${qs}`, '_blank,_self')
        win.focus()
    }

}

// export default CaDirectionProfile

const getFilterCriteria = (params, options) => {
    if (params && !_.isEmpty(params)) {
        let is_paid = (options && !_.isEmpty(options.isPaid)) ? `,${options.isPaid}` : ''

        let pattern = '&FILTER='
        let npl_pattern = null
        switch (params) {
            case 'New 0% WDPD':
                pattern = pattern + 'New'
                break;
            case 'Total Buckets':
                pattern = pattern + 'W0,W1,W2,W3,W4,XDay,M1,M2,NPL'
                break;
            case 'Current':
                pattern = pattern + 'W0,W1,W2,W3,W4'
                break;
            case 'TT W0':
                pattern = pattern + 'W0'
                break;
            case 'W0 (P1-2)':
                pattern = pattern + 'W0,YP1,YP2'
                break;
            case 'W0 (P3)':
                pattern = pattern + 'W0,YP3'
                break;
            case 'W0 (P4-5)':
                pattern = pattern + 'W0,YP4,YP5'
                break;
            case 'WDPD':
                pattern = pattern + 'W1,W2,W3,W4'
                break;
            case 'W1 (1-7 Day)':
                pattern = pattern + 'W1'
                break;
            case 'W2 (8-14 Day)':
                pattern = pattern + 'W2'
                break;
            case 'W3 (15-21 Day)':
                pattern = pattern + 'W3'
                break;
            case 'W4 (22-30 Day)':
                pattern = pattern + 'W4'
                break;
            case 'X-Day':
                pattern = pattern + 'XDay'
                break;
            case 'W5 (1-7 Day)':
                pattern = pattern + 'XDay&MDPD=1,7'
                break;
            case 'W6 (8-14 Day)':
                pattern = pattern + 'XDay&MDPD=8,14'
                break;
            case 'W7 (15-21 Day)':
                pattern = pattern + 'XDay&MDPD=15,21'
                break;
            case 'W8 (22-30 Day)':
                pattern = pattern + 'XDay&MDPD=22,30'
                break;
            case 'MDPD':
                pattern = pattern + 'M1,M2'
                break;
            case 'M1 (31-60 Day)':
                pattern = pattern + 'M1'
                break;
            case 'M2 (61-90 Day)':
                pattern = pattern + 'M2'
                break;
            case 'TT NPL':
                pattern = pattern + 'NPL'
                break;
            case 'Last Year NPL':
                npl_pattern = '&NPL=Old'
                break;
            case 'This Year NPL':
                npl_pattern = '&NPL=New'
                break;
        }

        return (npl_pattern) ? `${npl_pattern}${is_paid}` : `${pattern}${is_paid}`

    } else {
        return null
    }
}

export default connect((state) => ({
    AUTH_NANO_USER: state.AUTH_NANO_USER,
    NANO_BRANCH_DIRECTION_NOTE_DATA: state.NANO_BRANCH_DIRECTION_NOTE_DATA,
    NANO_BRANCH_DIRECTION_NOTE_STATUS: state.NANO_BRANCH_DIRECTION_NOTE_STATUS
}), {
        insertBranchDirectionNote: insertBranchDirectionNote,
        updateBranchDirectionNote: updateBranchDirectionNote,
        deleteBranchDirectionNote: deleteBranchDirectionNote,
    }
)(CaDirectionProfile)