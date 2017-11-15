import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Layout, Icon, Tooltip, Popover, Card, Timeline, Table } from 'antd';
import {
    Sector,
    Cell,
    PieChart,
    Pie,
    Tooltip as Tooltips,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Brush,
    CartesianGrid,
    CartesianAxis,
    Legend,
    Area,
    Line,
    Scatter,
    ComposedChart,
    ReferenceDot,
    Text,
    AreaChart,
    linearGradient
} from 'recharts'

import FontAwesome from 'react-fontawesome'
import moment from 'moment'

import styles from './index.scss'

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, percent, value, ...custom } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 5) * cos;
    const sy = cy + (outerRadius + 5) * sin;
    const mx = cx + (outerRadius + 10) * cos;
    const my = cy + (outerRadius + 10) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 12;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 3}
                outerRadius={outerRadius + 5}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + 3 + (cos >= 0 ? 1 : -1)} y={ey} textAnchor={textAnchor} fill="white" style={{ fontSize: '11px', fill: '#134973' }}  >
                {`${custom.ach} %`}
            </text>
        </g>
    );
}

const CustomizeLabelPerformance = props => {
    const { x, y, stroke, value, index, data, ...custom } = props
    const date = new Date()
    const month = moment(new Date(date.getFullYear(), index, 1)).format('MMM')

    return <text x={x - 5} y={y + 5} {...custom}>{`${parseFloat(data[month]).toFixed(0)}%`}</text>
}

class SaleSummaryChart extends Component {
    getHeaderTitle = (props) => {
        const { item, ON_CLOSE_MARKER, custom_width } = props

        if (item.MarketCode) {
            return (
                <div className={styles['headers']}>
                    <FontAwesome className="trigger" name='dollar' />
                    <span>
                        {`(${item.MarketCode}) ${item.MarketName} (${item.BranchType})`}
                    </span>
                    <Icon
                        onClick={() => ON_CLOSE_MARKER()}
                        className="trigger"
                        type='close' />
                </div>
            )
        }
        else {
            if (item.TM_Name) {
                return (
                    <div className={styles['headers']}>
                        {
                            <div className={styles['ca-imgs']}>
                                <Popover placement="left" content={
                                    <div className={styles['marker-tm-picture']}>
                                        <img className={styles['ca-big-img']} src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${item.TM_Code}`} />
                                        <span>{`${item.TM_Name}`} {`(${item.TM_NickName})`}</span>
                                        <span>{`${item.work_date_format}`}</span>
                                        <span>{`${item.TM_Tel}`}</span>
                                    </div>
                                } >
                                    <img src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${item.TM_Code}`} />
                                </Popover>
                            </div>
                        }
                        <span className={styles['title-img']}>
                            {`${item.BranchName}`}
                        </span>
                        <Icon
                            onClick={() => ON_CLOSE_MARKER()}
                            className="trigger"
                            type='close' />
                    </div>
                )
            }
            else {
                if (this.props.type) {
                    const { ca_code, ca_name, ca_nickname, work_date_format } = this.props.type
                    return (
                        <div className={styles['headers']}>
                            {
                                <div className={styles['ca-imgs']}>
                                    <Popover placement="left" content={
                                        <div className={styles['marker-tm-picture']}>
                                            <img className={styles['ca-big-img']} src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${ca_code}`} />
                                            <span>{`${ca_name}`} {`(${ca_nickname})`}</span>
                                            <span>{`${work_date_format}`}</span>
                                        </div>
                                    } >
                                        <img src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${ca_code}`} />
                                    </Popover>
                                </div>
                            }
                            <span className={styles['title-img']}>
                                {
                                    `${ca_name} (${work_date_format})`
                                }
                            </span>
                            <Icon
                                onClick={() => ON_CLOSE_MARKER()}
                                className="trigger"
                                type='close' />
                        </div>
                    )
                }
                else {
                    return (
                        <div className={styles['headers']}>
                            <FontAwesome className="trigger" name='dollar' />
                            <span>Sale Summary</span>
                            <Icon
                                onClick={() => ON_CLOSE_MARKER()}
                                className="trigger"
                                type='close' />
                        </div>
                    )
                }
            }
        }
    }

    render() {
        const { item, ON_CLOSE_MARKER, custom_width } = this.props

        const { SALE_SUMMARY_CHART } = item

        const NEW_VOLUME_PERFORMANCE = SALE_SUMMARY_CHART[1]

        const MAX_VOLUME_PERFORMANCE = Math.ceil((NEW_VOLUME_PERFORMANCE[1].Max + NEW_VOLUME_PERFORMANCE[2].Max) < NEW_VOLUME_PERFORMANCE[0].Max ? NEW_VOLUME_PERFORMANCE[0].Max : (NEW_VOLUME_PERFORMANCE[1].Max + NEW_VOLUME_PERFORMANCE[2].Max)).toFixed(0)

        let start_work_date, work_date_format
        if (!item.MarketCode) {
            start_work_date = !_.isEmpty(item.TM_WorkPeriod) ? moment.duration(moment(new Date()).diff(moment(item.TM_WorkPeriod)))._data : ''
            work_date_format = `Work Period : ${start_work_date.years}.${start_work_date.months}.${start_work_date.days}`
        }

        const testData = []

        for (let i = 1; i <= 31; i++) {
            let num = Math.floor((Math.random() * 10) + i)
            testData.push({ name: `${i}`, uv: Math.random() * num, pv: Math.random() * num, amt: Math.random() * num, av: Math.random() * num })
        }

        return (
            <Layout style={{ width: custom_width ? custom_width : '650px', overflow: 'hidden' }}>
                {
                    this.getHeaderTitle(this.props)
                }
                <Layout style={{ backgroundColor: '#FFF', margin: '10px 10px 5px 10px', backgroundColor: '#f0f2f5' }}>
                    <div style={{ marginLeft: '-5px', marginRight: '-5px', backgroundColor: '#f0f2f5' }}>
                        <div className={styles['chart-row']}>
                            <div className={styles['chart-container']} style={{ width: '330px', height: '237px', marginTop: '0px' }}>
                                <div>
                                    <span>New Volumne Performance</span>
                                </div>
                                <div>
                                    <ComposedChart width={320} height={195} data={[
                                        { name: 'J', MicroTotalAct: NEW_VOLUME_PERFORMANCE[2].Jan, NanoTotalAct: NEW_VOLUME_PERFORMANCE[1].Jan, TotalTarget: NEW_VOLUME_PERFORMANCE[0].Jan, Max: MAX_VOLUME_PERFORMANCE },
                                        { name: 'F', MicroTotalAct: NEW_VOLUME_PERFORMANCE[2].Feb, NanoTotalAct: NEW_VOLUME_PERFORMANCE[1].Feb, TotalTarget: NEW_VOLUME_PERFORMANCE[0].Feb, Max: MAX_VOLUME_PERFORMANCE },
                                        { name: 'M', MicroTotalAct: NEW_VOLUME_PERFORMANCE[2].Mar, NanoTotalAct: NEW_VOLUME_PERFORMANCE[1].Mar, TotalTarget: NEW_VOLUME_PERFORMANCE[0].Mar, Max: MAX_VOLUME_PERFORMANCE },
                                        { name: 'A', MicroTotalAct: NEW_VOLUME_PERFORMANCE[2].Apr, NanoTotalAct: NEW_VOLUME_PERFORMANCE[1].Apr, TotalTarget: NEW_VOLUME_PERFORMANCE[0].Apr, Max: MAX_VOLUME_PERFORMANCE },
                                        { name: 'M', MicroTotalAct: NEW_VOLUME_PERFORMANCE[2].May, NanoTotalAct: NEW_VOLUME_PERFORMANCE[1].May, TotalTarget: NEW_VOLUME_PERFORMANCE[0].May, Max: MAX_VOLUME_PERFORMANCE },
                                        { name: 'J', MicroTotalAct: NEW_VOLUME_PERFORMANCE[2].Jun, NanoTotalAct: NEW_VOLUME_PERFORMANCE[1].Jun, TotalTarget: NEW_VOLUME_PERFORMANCE[0].Jun, Max: MAX_VOLUME_PERFORMANCE },
                                        { name: 'J', MicroTotalAct: NEW_VOLUME_PERFORMANCE[2].Jul, NanoTotalAct: NEW_VOLUME_PERFORMANCE[1].Jul, TotalTarget: NEW_VOLUME_PERFORMANCE[0].Jul, Max: MAX_VOLUME_PERFORMANCE },
                                        { name: 'A', MicroTotalAct: NEW_VOLUME_PERFORMANCE[2].Aug, NanoTotalAct: NEW_VOLUME_PERFORMANCE[1].Aug, TotalTarget: NEW_VOLUME_PERFORMANCE[0].Aug, Max: MAX_VOLUME_PERFORMANCE },
                                        { name: 'S', MicroTotalAct: NEW_VOLUME_PERFORMANCE[2].Sep, NanoTotalAct: NEW_VOLUME_PERFORMANCE[1].Sep, TotalTarget: NEW_VOLUME_PERFORMANCE[0].Sep, Max: MAX_VOLUME_PERFORMANCE },
                                        { name: 'O', MicroTotalAct: NEW_VOLUME_PERFORMANCE[2].Oct, NanoTotalAct: NEW_VOLUME_PERFORMANCE[1].Oct, TotalTarget: NEW_VOLUME_PERFORMANCE[0].Oct, Max: MAX_VOLUME_PERFORMANCE },
                                        { name: 'N', MicroTotalAct: NEW_VOLUME_PERFORMANCE[2].Nov, NanoTotalAct: NEW_VOLUME_PERFORMANCE[1].Nov, TotalTarget: NEW_VOLUME_PERFORMANCE[0].Nov, Max: MAX_VOLUME_PERFORMANCE },
                                        { name: 'D', MicroTotalAct: NEW_VOLUME_PERFORMANCE[2].Dec, NanoTotalAct: NEW_VOLUME_PERFORMANCE[1].Dec, TotalTarget: NEW_VOLUME_PERFORMANCE[0].Dec, Max: MAX_VOLUME_PERFORMANCE }

                                    ]}
                                        margin={{ top: 5, right: 5, bottom: -13, left: -30 }}>
                                        <XAxis dataKey="name" tickLine={false} axisLine={true} style={{ fontSize: '9px' }} />
                                        <YAxis domain={['dataMin', MAX_VOLUME_PERFORMANCE]} />
                                        <Tooltips />
                                        <Bar dataKey='NanoTotalAct' barSize={15} stackId="a" fill='#023852' />
                                        <Bar dataKey="MicroTotalAct" barSize={15} stackId="a" fill="#03a694" />
                                        <Line dataKey="Max" dot={false} stroke='#FFF' label={<CustomizeLabelPerformance data={NEW_VOLUME_PERFORMANCE[3]} style={{ fontSize: '9px' }} />} />
                                        {
                                            !item.MarketCode &&
                                            <Line type='monotone' dataKey='TotalTarget' stroke='#851934' />
                                        }
                                    </ComposedChart>
                                </div>
                            </div>
                            <div>
                                <Timeline>
                                    <Timeline.Item style={{ paddingBottom: '0px' }} className={styles['no-padding-bottom-chart']}>
                                        <div className={styles['chart-container']} style={{ width: '228px', height: '95px', marginLeft: '-6px', marginTop: '3px' }}>
                                            <div>
                                                <span>% of Micro Share</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <div>
                                                    <PieChart
                                                        width={216}
                                                        height={75}
                                                        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                                        <Pie
                                                            data={[
                                                                { name: 'Nano', value: 100, ach: 10, color: '#023852' },
                                                                { name: 'Micro', value: 80, ach: 10, color: '#03a694' }
                                                            ]}
                                                            startAngle={450}
                                                            endAngle={-90}
                                                            innerRadius={0}
                                                            activeIndex={0}
                                                            activeShape={renderActiveShape}>
                                                            {
                                                                [
                                                                    { name: 'Nano', value: 400, ach: 10, color: '#023852' },
                                                                    { name: 'Micro', value: 300, ach: 10, color: '#03a694' }
                                                                ].map((entry, index) => <Cell fill={entry.color} />)
                                                            }
                                                        </Pie>
                                                    </PieChart>
                                                </div>
                                            </div>
                                        </div>
                                    </Timeline.Item>
                                    <Timeline.Item style={{ paddingBottom: '0px' }} className={styles['no-padding-bottom-chart']}>
                                        <div className={styles['chart-container']} style={{ width: '228px', height: '137', marginLeft: '-6px', marginTop: '3px' }}>
                                            <div style={{ border: '1px solid #024959' }}>
                                                <div style={{ backgroundColor: '#024959', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
                                                    <span>YTD : 9,999,999 MB</span>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                    <div>
                                                        {
                                                            !this.props.type ?
                                                                <ComposedChart width={210} height={106} data={[
                                                                    { name: 'J', uv: 5, pv: 800, amt: 1400, av: 1200 },
                                                                    { name: 'F', uv: 3, pv: 967, amt: 1506, av: 300 },
                                                                    { name: 'M', uv: 10, pv: 1098, amt: 989, av: 600 },
                                                                    { name: 'A', uv: 2, pv: 1200, amt: 1228, av: 400 },
                                                                    { name: 'M', uv: 0.5, pv: 1108, amt: 1100, av: 890 },
                                                                    { name: 'J', uv: 2, pv: 680, amt: 1700, av: 950 },
                                                                    { name: 'J', uv: 2, pv: 680, amt: 1700, av: 950 },
                                                                    { name: 'A', uv: 3, pv: 680, amt: 1700, av: 950 },
                                                                    { name: 'S', uv: 1.5, pv: 680, amt: 1700, av: 950 },
                                                                    { name: 'O', uv: 6, pv: 680, amt: 1700, av: 950 },
                                                                    { name: 'N', uv: 8, pv: 680, amt: 1700, av: 950 },
                                                                    { name: 'D', uv: 4, pv: 680, amt: 1700, av: 950 }

                                                                ]}
                                                                    margin={{ left: -38, right: 0, top: 10, bottom: -10 }}>
                                                                    <XAxis dataKey="name" tickLine={false} style={{ fontSize: '9px' }} />
                                                                    <YAxis />
                                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                                    <Line type='monotone' dataKey='uv' stroke='#f24738' />
                                                                </ComposedChart>
                                                                :
                                                                <PieChart
                                                                    width={130}
                                                                    height={106}
                                                                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                                                    <Pie
                                                                        data={[
                                                                            { name: 'M1', value: 400, ach: 10, color: '#7b2a3b' },
                                                                            { name: 'M2', value: 300, ach: 10, color: '#e57661' },
                                                                            { name: 'M3', value: 300, ach: 10, color: '#f8c58c' },
                                                                            { name: 'M4', value: 200, ach: 10, color: '#f8e7a4' },
                                                                            { name: 'M5', value: 200, ach: 10, color: '#86ddb2' },
                                                                        ]}
                                                                        fill="#8884d8"
                                                                    >
                                                                        {
                                                                            [
                                                                                { name: 'M1', value: 400, ach: 10, color: '#7b2a3b' },
                                                                                { name: 'M2', value: 300, ach: 10, color: '#e57661' },
                                                                                { name: 'M3', value: 300, ach: 10, color: '#f8c58c' },
                                                                                { name: 'M4', value: 200, ach: 10, color: '#f8e7a4' },
                                                                                { name: 'M5', value: 200, ach: 10, color: '#86ddb2' },
                                                                            ].map((entry, index) => <Cell fill={entry.color} />)
                                                                        }
                                                                    </Pie>
                                                                </PieChart>
                                                        }
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        {
                                                            this.props.type &&
                                                            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px', justifyContent: 'center' }}>
                                                                {
                                                                    [
                                                                        { name: 'M1', value: 400, ach: 10, color: '#7b2a3b' },
                                                                        { name: 'M2', value: 300, ach: 10, color: '#e57661' },
                                                                        { name: 'M3', value: 300, ach: 10, color: '#f8c58c' },
                                                                        { name: 'M4', value: 200, ach: 10, color: '#f8e7a4' },
                                                                        { name: 'M5', value: 200, ach: 10, color: '#86ddb2' },
                                                                    ].map(
                                                                        (item, index) =>
                                                                            <div className={styles['color-dot-container']}>
                                                                                <span className={styles['color-dot']} style={{ backgroundColor: item.color }}></span>
                                                                                <span>{`${item.name} ${item.ach}%`}</span>
                                                                            </div>
                                                                        )
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Timeline.Item>
                                </Timeline>
                            </div>
                        </div>
                        <div className={styles['chart-row']}>
                            <div className={styles['chart-container']} style={{ width: '160px' }}>
                                <div>
                                    <span>App On Hand (Before Oper)</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <Table columns={[{
                                        title: 'Type',
                                        className: `${styles['align-left']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
                                        dataIndex: 'type',
                                        key: 'type',
                                        render: (text, record, index) => {
                                            return <span>{text}</span>
                                        }
                                    }, {
                                        title: 'MB',
                                        className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
                                        dataIndex: 'act',
                                        key: 'act',
                                        render: (text, record, index) => {
                                            return <span>{text}</span>
                                        }
                                    }, {
                                        title: '%',
                                        className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
                                        dataIndex: 'ach',
                                        key: 'ach',
                                        render: (text, record, index) => {
                                            return <span>{text}%</span>
                                        }
                                    }]} dataSource={[{
                                        type: 'CA',
                                        ach: '10',
                                        act: '50'
                                    }, {
                                        type: 'FC',
                                        ach: '10',
                                        act: '50'
                                    }, {
                                        type: 'ZM',
                                        ach: '10',
                                        act: '50'
                                    }, {
                                        type: 'BM-TM',
                                        ach: '10',
                                        act: '50'
                                    }]}
                                        pagination={false}
                                        size='small'
                                        className={styles['summary-table']}
                                        style={{ width: '100%', fontSize: '8px' }} />
                                </div>
                            </div>
                            <div className={styles['chart-container']}>
                                <div style={{ textAlign: 'right', paddingRight: '10px' }}>
                                    <span>Daily App At Oper (Total 10 App)</span>
                                </div>
                                <div className={styles['app-daily-overlay']}>
                                    <div>
                                        <span>Confirm</span>
                                        <span>20 App</span>
                                        <span>1.8K</span>
                                        <span>10%</span>
                                    </div>
                                    <div>
                                        <span>Return</span>
                                        <span>10 App</span>
                                        <span>2.3M</span>
                                        <span>20%</span>
                                    </div>
                                </div>
                                <div>
                                    <ComposedChart width={405} height={105} data={testData}
                                        margin={{ top: 0, right: 0, bottom: -17, left: 0 }}>
                                        <XAxis dataKey="name" tickLine={false} axisLine={true} style={{ fontSize: '9px' }} />
                                        <YAxis hide={true} />
                                        <Tooltip />
                                        <Bar dataKey='pv' barSize={8} stackId="a" fill='#08415a' />
                                        <Line type='monotone' dataKey='uv' stroke='#a72c0d' dot={false} />
                                    </ComposedChart>
                                </div>
                            </div>
                        </div>
                    </div>
                </Layout>
            </Layout>
        )
    }
}

export default connect(
    (state) => ({
    }), {
    })(SaleSummaryChart)