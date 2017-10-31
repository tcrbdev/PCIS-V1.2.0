import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    setOpenExitingMarketMarker,
} from '../actions/nanomaster'

import { Layout, Icon, Tooltip, Popover, Card } from 'antd';
import {
    Sector,
    Cell,
    PieChart,
    Pie as Pies,
    Tooltip as Tooltips,
    BarChart,
    Bar as Bars,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    Area,
    Line as Lines,
    Scatter,
    ComposedChart,
    ReferenceDot,
    Text
} from 'recharts'
import { Doughnut, HorizontalBar, Bar, Pie, Line } from 'react-chartjs-2'
import FontAwesome from 'react-fontawesome'
import moment from 'moment'

import styles from './index.scss'

const NotAxisTickButLabel = props => {
    return (
        <text x={props.x} y={props.y} dy={3} fontFamily="Kanit" fontSize="11px" textAnchor="end" fill={"#565656"}  >{props.payload.value}</text>)
}

const CustomizedDot = props => {
    const { cx, cy, tickSize, ...custom } = props

    return (<path d={`M${cx},${cy}L${cx - tickSize},${cy - tickSize}L${cx + tickSize},${cy - tickSize}Z`} {...custom} />)
}

const CustomizeLabel = props => {
    const { x, y, stroke, value, index, dataItem, ...custom } = props

    return <text x={x} y={y} dy={-10} {...custom}>{`${parseFloat(dataItem[index].TotalAch).toFixed(1)}%`}</text>
}


const RenderPathStackBar = (x, y, width, height, fill) => {
    return <path d={`M${x},${y} L${x + width},${y} L${x + width},${y + height} L${x},${y + height}  Z`} stroke="none" fill={fill} />
}

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, ...custom }) => {

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (custom.name != 'DPD') {
        return (
            <g>
                <text x={x - 8} y={y - 12} fill="white" style={{ fontSize: '12px', fill: '#134973' }} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                    {`${custom.payload.act} Unit`}
                </text>
                <text x={x - 8} y={y} fill="white" style={{ fontSize: '12px', fill: '#134973' }} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                    {`${custom.payload.TotalAmt}`}
                </text>
            </g>
        )
    }
}

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
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
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
}

const GaugeChart = (props) => {

    const { data, colorData } = props

    const width = 140;
    const height = 117;
    const chartValue = 100//data.FirstPinAch;


    const activeSectorIndex = colorData.map((cur, index, arr) => {
        const curMax = [...arr]
            .splice(0, index + 1)
            .reduce((a, b) => ({ value: a.value + b.value }))
            .value;
        return (chartValue > (curMax - cur.value)) && (chartValue <= curMax);
    })
        .findIndex(cur => cur);

    const sumValues = colorData
        .map(cur => cur.value)
        .reduce((a, b) => a + b);

    const arrowData = [
        { value: data.FirstPinAch < 0 ? 0 : data.FirstPinAch },
        { value: 0 },
        { value: sumValues - (data.FirstPinAch < 0 ? 0 : data.FirstPinAch) }
    ];

    const arrowData2 = [
        { value: data.SecondPinAch < 0 ? 0 : data.SecondPinAch },
        { value: 0 },
        { value: sumValues - (data.SecondPinAch < 0 ? 0 : data.SecondPinAch) }
    ];

    const pieProps = {
        startAngle: 225,
        endAngle: -45,
        cy: height - 25
    };

    const pieRadius = {
        innerRadius: (width) * 0.35,
        outerRadius: (width) * 0.4
    };

    const Arrow = ({ cx, cy, midAngle, outerRadius }) => { //eslint-disable-line react/no-multi-comp
        const RADIAN = Math.PI / 180;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const mx = cx + (outerRadius + width * 0.03) * cos;
        const my = cy + (outerRadius + width * 0.03) * sin;
        return (
            <g>
                <path d={`M${cx},${cy}L${mx},${my}`} strokeWidth="4" stroke="#000" fill="none" strokeLinecap="round" />
                <circle cx={cx} cy={cy} r={width * 0.05} fill="#666" stroke="none" />
            </g>
        );
    };

    const Arrow2 = ({ cx, cy, midAngle, outerRadius }) => { //eslint-disable-line react/no-multi-comp
        const RADIAN = Math.PI / 180;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const mx = (cx) + ((outerRadius - 15) + width * 0.03) * cos;
        const my = (cy) + ((outerRadius - 15) + width * 0.03) * sin;
        return (
            <g>
                <path d={`M${cx},${cy}L${mx},${my}`} strokeWidth="4" stroke="#ff7300" fill="none" strokeLinecap="round" />
                <circle cx={cx} cy={cy} r={width * 0.05} fill="#666" />
            </g>
        );
    };

    const ActiveSectorMark = ({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill }) => { //eslint-disable-line react/no-multi-comp
        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius * 1.2}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
            </g>
        );
    };

    return (
        <PieChart width={width} height={height} margin={{ top: -30, right: 0, left: -10, bottom: 0 }}>
            <Pies
                activeIndex={activeSectorIndex}
                data={colorData}
                innerRadius={(width) * 0.23}
                { ...pieProps }
                strokeWidth={0}>
                {
                    colorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colorData[index].color} />
                    ))
                }
            </Pies>
            <Pies
                name="needle_1"
                stroke="none"
                activeIndex={1}
                activeShape={Arrow}
                data={arrowData}
                outerRadius={pieRadius.innerRadius}
                fill="none"
                { ...pieProps }
            />
            <Pies
                name="needle_2"
                stroke="none"
                activeIndex={1}
                activeShape={Arrow2}
                data={arrowData2}
                outerRadius={pieRadius.innerRadius}
                fill="none"
                { ...pieProps }
            />
            <Tooltips content={<CollectionMovementTooltip />} />
        </PieChart>
    );
}

const GaugeChart1Needle = (props) => {

    const { data, colorData } = props

    const width = 140;
    const height = 117;
    const chartValue = 100//data.FirstPinAch;

    const activeSectorIndex = colorData.map((cur, index, arr) => {
        const curMax = [...arr]
            .splice(0, index + 1)
            .reduce((a, b) => ({ value: a.value + b.value }))
            .value;
        return (chartValue > (curMax - cur.value)) && (chartValue <= curMax);
    })
        .findIndex(cur => cur);

    const sumValues = colorData
        .map(cur => cur.value)
        .reduce((a, b) => a + b);

    const arrowData = [
        { value: data.RankAch < 0 ? 0 : data.RankAch },
        { value: 0 },
        { value: sumValues - (data.RankAch < 0 ? 0 : data.RankAch) }
    ];

    const pieProps = {
        startAngle: 225,
        endAngle: -45,
        cy: height - 25
    };

    const pieRadius = {
        innerRadius: (width) * 0.35,
        outerRadius: (width) * 0.4
    };

    const Arrow = ({ cx, cy, midAngle, outerRadius }) => { //eslint-disable-line react/no-multi-comp
        const RADIAN = Math.PI / 180;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const mx = cx + ((outerRadius - 15) + width * 0.03) * cos;
        const my = cy + ((outerRadius - 15) + width * 0.03) * sin;
        return (
            <g>
                <path d={`M${cx},${cy}L${mx},${my}`} strokeWidth="4" stroke="#000" fill="none" strokeLinecap="round" />
                <circle cx={cx} cy={cy} r={width * 0.05} fill="#666" stroke="none" />
            </g>
        );
    };

    const Arrow2 = ({ cx, cy, midAngle, outerRadius }) => { //eslint-disable-line react/no-multi-comp
        const RADIAN = Math.PI / 180;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const mx = cx + (outerRadius + width * 0.03) * cos;
        const my = cy + (outerRadius + width * 0.03) * sin;
        return (
            <g>
                <path d={`M${cx},${cy}L${mx},${my}`} strokeWidth="4" stroke="#ff7300" fill="none" strokeLinecap="round" />
                <circle cx={cx} cy={cy} r={width * 0.05} fill="#666" />
            </g>
        );
    };

    const ActiveSectorMark = ({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill }) => { //eslint-disable-line react/no-multi-comp
        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius * 1.2}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
            </g>
        );
    };

    return (
        <PieChart width={width} height={height} margin={{ top: -30, right: 0, left: -10, bottom: 0 }}>
            <Pies
                activeIndex={activeSectorIndex}
                data={colorData}
                innerRadius={(width) * 0.23}
                { ...pieProps }
                strokeWidth={0}>
                {
                    colorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colorData[index].color} />
                    ))
                }
            </Pies>
            <Pies
                stroke="none"
                activeIndex={1}
                activeShape={Arrow}
                data={arrowData}
                outerRadius={pieRadius.innerRadius}
                fill="none"
                { ...pieProps }
            />
        </PieChart>
    );
}

// const CollectionMovementShape = props => {
//     const { fill, x, y, width, height, name, stackIndex } = props
//     switch (name) {
//         // case 'NPL':
//         // case 'M1-2':
//         //     if (stackIndex == 1)
//         //     { return RenderPathStackBar(x, y, width, height, '#65bb02') }
//         //     else
//         //     { return RenderPathStackBar(x, y, width, height, '#f51100') }
//         //     break;
//         default:
//             // return RenderPathStackBar(x, y, width, height, fill)
//                         if (stackIndex == 1)
//             { return RenderPathStackBar(x, y, width, height, '#65bb02') }
//             else
//             { return RenderPathStackBar(x, y, width, height, '#f51100') }
//             break;
//             break;
//     }
// }

class PortfolioChart extends Component {
    render() {
        const { item, ON_CLOSE_MARKER, custom_width } = this.props

        let start_work_date, work_date_format
        if (!item.MarketCode) {
            start_work_date = !_.isEmpty(item.TM_WorkPeriod) ? moment.duration(moment(new Date()).diff(moment(item.TM_WorkPeriod)))._data : ''
            work_date_format = `Work Period : ${start_work_date.years}.${start_work_date.months}.${start_work_date.days}`
        }

        return (
            <Layout style={{ width: custom_width ? custom_width : '650px', overflow: 'hidden' }}>
                {
                    item.MarketCode ?
                        (
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
                        :
                        (
                            <div className={styles['headers']}>
                                {
                                    <div className={styles['ca-imgs']}>
                                        <Popover placement="left" content={
                                            <div className={styles['marker-tm-picture']}>
                                                <img className={styles['ca-big-img']} src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${item.TM_Code}`} />
                                                <span>{`${item.TM_Name}`} {`(${item.TM_NickName})`}</span>
                                                <span>{`${work_date_format}`}</span>
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
                <Layout style={{ backgroundColor: '#FFF', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <div className={`${styles['chart-card']} ${styles['card-orange']}`} style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className={styles['chart-header']}>
                                <span>Trend</span>
                            </div>
                            <div style={{ width: '180px', height: '30px', marginTop: '10px', marginLeft: '5px' }}>
                                <Line
                                    data={{
                                        datasets: [{
                                            data: [30, 10, 60, 75, 45, 20],
                                            fill: false,
                                            borderColor: '#FFF',
                                            backgroundColor: '#FFF',
                                        }, {
                                            data: [80, 40, 15, 20, 90, 50],
                                            fill: false,
                                            borderColor: '#607d8b',
                                            backgroundColor: '#607d8b',
                                        }, {
                                            data: [0, 100, 50, 45, 20, 30],
                                            fill: false,
                                            borderColor: '#2196F3',
                                            backgroundColor: '#2196F3',
                                        }],
                                        labels: ['NPL', 'M2', 'M1', 'X Day', 'W3-4', 'W1-2']
                                    }}
                                    options={{
                                        legend: { display: false },
                                        maintainAspectRatio: false,
                                        tooltips: {
                                            mode: 'point'
                                        },
                                        scales: {
                                            xAxes: [{
                                                display: false
                                            }],
                                            yAxes: [{
                                                display: false
                                            }]
                                        }
                                    }} />
                            </div>
                        </div>
                        <div className={`${styles['chart-card']} ${styles['card-blue']}`}>
                            <div className={styles['chart-header']}>
                                <span>Portfolio Quality</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '25px', marginLeft: '5px', marginTop: '5px' }}>80%</span>
                                <div style={{ width: '120px', height: '30px', marginLeft: '7px' }}>
                                    <Bar
                                        data={{
                                            datasets: [{
                                                data: [80, 40, 15, 20, 90, 50, 60, 75, 45],
                                                type: 'line',
                                                fill: false,
                                                borderColor: '#EC932F',
                                                backgroundColor: '#EC932F',
                                                pointBorderColor: '#EC932F',
                                                pointBackgroundColor: '#EC932F',
                                                pointHoverBackgroundColor: '#EC932F',
                                                pointHoverBorderColor: '#EC932F',
                                                yAxisID: 'y-axis-1'
                                            }, {
                                                data: [30, 10, 60, 75, 45, 20, 60, 75, 45],
                                                fill: false,
                                                borderColor: '#FFF',
                                                backgroundColor: '#FFF',
                                            }, {
                                                data: [80, 40, 15, 20, 90, 50, 60, 75, 45],
                                                fill: false,
                                                borderColor: '#607d8b',
                                                backgroundColor: '#607d8b',
                                                yAxisID: 'y-axis-2'
                                            }],
                                            labels: ['NPL', 'M2', 'M1', 'X Day', 'W3-4', 'W1-2', 'xx', 'xxx', 'xxxx']
                                        }}
                                        options={{
                                            legend: { display: false },
                                            maintainAspectRatio: false,
                                            tooltips: {
                                                mode: 'point'
                                            },
                                            scales: {
                                                xAxes: [{
                                                    display: false,
                                                    stacked: true,
                                                    barPercentage: 0.6,
                                                }],
                                                yAxes: [{
                                                    display: false,
                                                    stacked: true,
                                                    position: 'left',
                                                    id: 'y-axis-2',
                                                }, {
                                                    type: 'linear',
                                                    display: false,
                                                    position: 'left',
                                                    id: 'y-axis-1',
                                                    gridLines: {
                                                        display: false
                                                    },
                                                    labels: {
                                                        show: true
                                                    }
                                                }]
                                            }
                                        }} />
                                </div>
                            </div>
                        </div>
                        <div className={`${styles['chart-card']} ${styles['card-pink']}`}>
                            <div className={styles['chart-header']}>
                                <span>% Collection Succ.</span>
                            </div>
                            <div style={{ marginLeft: '10px', display: 'flex' }}>
                                <span style={{ fontSize: '25px', marginLeft: '20px' }}>{item.PORTFOLIO_QUALITY_CHART[3][0].SuccessRate}%</span>
                                <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', marginLeft: '20px', color: '#FFF', justifyContent: 'center' }}>
                                    <span>- {item.PORTFOLIO_QUALITY_CHART[3][0].TotalAct}.</span>
                                    <span>- {item.PORTFOLIO_QUALITY_CHART[3][0].TotalAmt}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px' }}>
                        <div className={styles['bg-chart']} style={{ display: 'flex', flexDirection: 'column', width: '190px', height: '170px', padding: '5px' }}>
                            <div>
                                <span className={styles['header-other-chart']}>Collection Movement Trend</span>
                            </div>
                            <div id="my-chart" style={{ flex: '1', width: '100%', height: '100px' }}>
                                <ComposedChart layout="vertical" width={178} height={142}
                                    margin={{ top: 5, right: 15, left: -20, bottom: 0 }}
                                    data={
                                        [{ name: 'NPL', red: item.PORTFOLIO_QUALITY_CHART[0][0].RankR, yellow: item.PORTFOLIO_QUALITY_CHART[0][0].RankY, green: item.PORTFOLIO_QUALITY_CHART[0][0].RankG, actual: item.PORTFOLIO_QUALITY_CHART[0][0].RankAch },
                                        { name: 'M1-2', red: item.PORTFOLIO_QUALITY_CHART[0][1].RankR, yellow: item.PORTFOLIO_QUALITY_CHART[0][1].RankY, green: item.PORTFOLIO_QUALITY_CHART[0][1].RankG, actual: item.PORTFOLIO_QUALITY_CHART[0][1].RankAch },
                                        { name: 'X Day', red: item.PORTFOLIO_QUALITY_CHART[0][2].RankR, yellow: item.PORTFOLIO_QUALITY_CHART[0][2].RankY, green: item.PORTFOLIO_QUALITY_CHART[0][2].RankG, actual: item.PORTFOLIO_QUALITY_CHART[0][2].RankAch },
                                        { name: 'W3-4', red: item.PORTFOLIO_QUALITY_CHART[0][3].RankR, yellow: item.PORTFOLIO_QUALITY_CHART[0][3].RankY, green: item.PORTFOLIO_QUALITY_CHART[0][3].RankG, actual: item.PORTFOLIO_QUALITY_CHART[0][3].RankAch },
                                        { name: 'W1-2', red: item.PORTFOLIO_QUALITY_CHART[0][4].RankR, yellow: item.PORTFOLIO_QUALITY_CHART[0][4].RankY, green: item.PORTFOLIO_QUALITY_CHART[0][4].RankG, actual: item.PORTFOLIO_QUALITY_CHART[0][4].RankAch }]
                                    }>
                                    <XAxis type="number" hide={true} padding={{ left: 7 }} />
                                    <YAxis dataKey="name" type="category" tick={<NotAxisTickButLabel />} tickLine={false} axisLine={false} />
                                    <Bars dataKey="green" barSize={12} stackId="a" fill="#65bb02" />
                                    <Bars dataKey="yellow" stackId="a" fill="#ffc925" />
                                    <Bars dataKey="red" stackId="a" fill="#f51100" />
                                    <Lines
                                        dataKey='actual'
                                        stroke='#ff7300'
                                        label={<CustomizeLabel fontSize={10} dataItem={item.PORTFOLIO_QUALITY_CHART[0]} style={{ fill: '#0d64a9', fontWeight: '600' }} textAnchor="middle" />}
                                        dot={<CustomizedDot tickSize={8} fill="#2196f3" stroke="#1672bc" />} activeDot={false} stroke={false} />
                                </ComposedChart>
                            </div>
                        </div>
                        <div className={styles['bg-chart']} style={{ display: 'flex', flexDirection: 'column', width: '190px', height: '170px', padding: '5px' }}>
                            <div>
                                <span className={styles['header-other-chart']}>% of Current (W0 >87%)</span>
                            </div>
                            <div style={{ flex: '1', width: '100%', height: '100px' }}>
                                <CurrentPieChart
                                    data={item.PORTFOLIO_QUALITY_CHART[1][0].TotalAch}
                                    act={item.PORTFOLIO_QUALITY_CHART[1][0].TotalAct}
                                    unit={item.PORTFOLIO_QUALITY_CHART[1][0].TotalAch}
                                    TotalAmt={item.PORTFOLIO_QUALITY_CHART[1][0].TotalAmt} />
                            </div>
                        </div>
                        <div className={styles['bg-chart']} style={{ display: 'flex', flexDirection: 'column', width: '190px', height: '170px', padding: '5px' }}>
                            <div style={{ marginBottom: '5px' }}>
                                <span className={styles['header-other-chart']}>Wkcycle Due Plan</span>
                            </div>
                            <div style={{ flex: '1', width: '100%', height: '100px' }}>
                                <Bar
                                    data={{
                                        datasets: [{
                                            data: [
                                                item.PORTFOLIO_QUALITY_CHART[2][0].Mon,
                                                item.PORTFOLIO_QUALITY_CHART[2][0].Tue,
                                                item.PORTFOLIO_QUALITY_CHART[2][0].Wed,
                                                item.PORTFOLIO_QUALITY_CHART[2][0].Thu,
                                                item.PORTFOLIO_QUALITY_CHART[2][0].Fri],
                                            backgroundColor: ['#f7d827', '#ef3ecf', '#17b21e', '#d64713', '#12c0e8'],
                                        }],
                                        labels: ['จ', 'อ', 'พ', 'พฤ', 'ศ']
                                    }}
                                    options={{
                                        legend: { display: false },
                                        maintainAspectRatio: false,
                                        scales: {
                                            yAxes: [{
                                                display: true
                                            }]
                                        }
                                    }} />
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px' }}>
                        <div className={styles['bg-chart']} style={{ display: 'flex', flexDirection: 'column', width: '142', height: '160px', padding: '5px' }}>
                            <div style={{ marginBottom: '5px' }}>
                                <span className={styles['header-other-chart']}>%Flow Rate 0 MDPD</span>
                            </div>
                            <div style={{ flex: '1', width: '100%', height: '100px', position: 'relative' }}>
                                <GaugeChart data={item.PORTFOLIO_QUALITY_CHART[4][0]} colorData={[{
                                    value: item.PORTFOLIO_QUALITY_CHART[4][0].RankG, // span 140 to 190
                                    color: '#65bb02',
                                    max: item.PORTFOLIO_QUALITY_CHART[4][0].MaxG
                                }, {
                                    value: item.PORTFOLIO_QUALITY_CHART[4][0].RankY, // span 40 to 140
                                    color: '#ffc925',
                                    max: item.PORTFOLIO_QUALITY_CHART[4][0].MaxY
                                }, {
                                    value: item.PORTFOLIO_QUALITY_CHART[4][0].RankR, // Meaning span is 0 to 40
                                    color: '#f51100',
                                    max: item.PORTFOLIO_QUALITY_CHART[4][0].MaxR
                                }]} />
                                <div className={styles['gauge-value']}>
                                    <span>{item.PORTFOLIO_QUALITY_CHART[4][0].MinRank}%</span>
                                    <span>{item.PORTFOLIO_QUALITY_CHART[4][0].MaxRank}%</span>
                                </div>
                                <div className={styles['gauge-percent']}>
                                    <span>{parseFloat(item.PORTFOLIO_QUALITY_CHART[4][0].FirstPinAch).toFixed(1)}%</span>
                                    <span>F {parseFloat(item.PORTFOLIO_QUALITY_CHART[4][0].SecondPinAch).toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles['bg-chart']} style={{ display: 'flex', flexDirection: 'column', width: '142', height: '160px', padding: '5px' }}>
                            <div style={{ marginBottom: '5px' }}>
                                <span className={styles['header-other-chart']}>%Flow Rate 1-30 MDPD</span>
                            </div>
                            <div style={{ flex: '1', width: '100%', height: '100px', position: 'relative' }}>
                                <GaugeChart data={item.PORTFOLIO_QUALITY_CHART[4][1]} colorData={[{
                                    value: item.PORTFOLIO_QUALITY_CHART[4][1].RankG, // span 140 to 190
                                    color: '#65bb02',
                                    max: item.PORTFOLIO_QUALITY_CHART[4][1].MaxG
                                }, {
                                    value: item.PORTFOLIO_QUALITY_CHART[4][1].RankY, // span 40 to 140
                                    color: '#ffc925',
                                    max: item.PORTFOLIO_QUALITY_CHART[4][1].MaxY
                                }, {
                                    value: item.PORTFOLIO_QUALITY_CHART[4][1].RankR, // Meaning span is 0 to 40
                                    color: '#f51100',
                                    max: item.PORTFOLIO_QUALITY_CHART[4][1].MaxR
                                }]} />
                                <div className={styles['gauge-value']}>
                                    <span>{item.PORTFOLIO_QUALITY_CHART[4][1].MinRank}%</span>
                                    <span>{item.PORTFOLIO_QUALITY_CHART[4][1].MaxRank}%</span>
                                </div>
                                <div className={styles['gauge-percent']}>
                                    <span>{parseFloat(item.PORTFOLIO_QUALITY_CHART[4][1].FirstPinAch).toFixed(1)}%</span>
                                    <span>F {parseFloat(item.PORTFOLIO_QUALITY_CHART[4][1].SecondPinAch).toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles['bg-chart']} style={{ display: 'flex', flexDirection: 'column', width: '142', height: '160px', padding: '5px' }}>
                            <div style={{ marginBottom: '5px' }}>
                                <span className={styles['header-other-chart']}>%Flow Rate 31-60 MDPD</span>
                            </div>
                            <div style={{ flex: '1', width: '100%', height: '100px', position: 'relative' }}>
                                <GaugeChart data={item.PORTFOLIO_QUALITY_CHART[4][2]} colorData={[{
                                    value: item.PORTFOLIO_QUALITY_CHART[4][2].RankG, // Meaning span is 0 to 40
                                    color: '#65bb02',
                                    max: item.PORTFOLIO_QUALITY_CHART[4][2].MaxG
                                }, {
                                    value: item.PORTFOLIO_QUALITY_CHART[4][2].RankY, // span 40 to 140
                                    color: '#ffc925',
                                    max: item.PORTFOLIO_QUALITY_CHART[4][2].MaxY
                                }, {
                                    value: item.PORTFOLIO_QUALITY_CHART[4][2].RankR, // span 140 to 190
                                    color: '#f51100',
                                    max: item.PORTFOLIO_QUALITY_CHART[4][2].MaxR
                                }]} />
                                <div className={styles['gauge-value']}>
                                    <span>{item.PORTFOLIO_QUALITY_CHART[4][2].MinRank}%</span>
                                    <span>{item.PORTFOLIO_QUALITY_CHART[4][2].MaxRank}%</span>
                                </div>
                                <div className={styles['gauge-percent']}>
                                    <span>{parseFloat(item.PORTFOLIO_QUALITY_CHART[4][2].FirstPinAch).toFixed(1)}%</span>
                                    <span>F {parseFloat(item.PORTFOLIO_QUALITY_CHART[4][2].SecondPinAch).toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles['bg-chart']} style={{ display: 'flex', flexDirection: 'column', width: '142', height: '160px', padding: '5px' }}>
                            <div style={{ marginBottom: '5px' }}>
                                <span className={styles['header-other-chart']}>%0 WDPD of New Cust.</span>
                            </div>
                            <div style={{ flex: '1', width: '100%', height: '100px', position: 'relative' }}>
                                <GaugeChart1Needle data={item.PORTFOLIO_QUALITY_CHART[5][0]} colorData={[{
                                    value: 99, // Meaning span is 0 to 40
                                    color: '#f51100'
                                }, {
                                    value: 1, // Meaning span is 0 to 40
                                    color: '#65bb02'
                                }]} />
                                <div className={styles['gauge-value']}>
                                    <span>{item.PORTFOLIO_QUALITY_CHART[5][0].MinRank}%</span>
                                    <span>{item.PORTFOLIO_QUALITY_CHART[5][0].MaxRank}%</span>
                                </div>
                                <div className={styles['gauge-percents']}>
                                    <span>{parseFloat(item.PORTFOLIO_QUALITY_CHART[5][0].RankAch).toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Layout>
            </Layout>
        )
    }
}

class CurrentPieChart extends Component {

    render() {
        const data = [{
            name: 'W0',
            value: parseFloat(parseFloat(this.props.data).toFixed(0)),
            act: parseFloat(parseFloat(this.props.act).toFixed(0)),
            TotalAmt: this.props.TotalAmt
        }, {
            name: 'DPD',
            value: parseFloat(parseFloat(100 - this.props.data).toFixed(0)),
            act: parseFloat(parseFloat(this.props.act).toFixed(0)),
            TotalAmt: this.props.TotalAmt
        }]

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
                    <text x={cx} y={cy - 4} dy={8} textAnchor="middle" fontFamily="Kanit" fontSize="13px" style={{ fontWeight: 'bold' }} fill={'#0a67b1'}>{parseInt(this.props.unit)}%</text>
                    {/* <text x={cx} y={cy + 3} dy={8} textAnchor="middle" fontFamily="Kanit" fontSize="9px" fill={'#313131'}>Unit.</text> */}
                    <Sector
                        cx={cx}
                        cy={cy}
                        innerRadius={innerRadius}
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
                        innerRadius={outerRadius + 5}
                        outerRadius={outerRadius + 7}
                        fill={fill}
                    />
                    <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                    <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                    <text x={ex + (cos >= 0 ? 1 : -1)} y={ey - 4} textAnchor={textAnchor} fill="white" style={{ fontSize: '11px', fill: '#134973' }}  >
                        {`${custom.act} Unit`}
                    </text>
                    <text x={ex + (cos >= 0 ? 1 : -1) - 7} y={ey + 14} textAnchor={textAnchor} style={{ fontSize: '11px', fill: '#134973' }} >
                        {`${custom.TotalAmt}`}
                    </text>
                </g>
            );
        }

        return (
            <PieChart width={178} height={142} margin={{ top: 10, right: 40, left: 0, bottom: 12 }}>
                <Pies
                    data={data}
                    labelLine={false}
                    startAngle={450}
                    endAngle={-90}
                    innerRadius={20}
                    activeIndex={0}
                    activeShape={renderActiveShape}>
                    {
                        data.map((entry, index) => <Cell fill={['#607d8b', '#795548'][index % 2]} />)
                    }
                </Pies>
            </PieChart>
        )
    }
}

class CollectionMovementTooltip extends Component {
    render() {
        const { active, payload } = this.props
        console.log(payload)
        if (active) {
            const { payload, label, coordinate } = this.props
            return <div key={`${label}_${coordinate.x}_${coordinate.y}`} className={styles['custom-tooltip']}>{payload[0].payload.max}%</div>
        }
        else {
            return <div></div>
        }
    }
}

export default connect(
    (state) => ({
    }), {
        setOpenExitingMarketMarker: setOpenExitingMarketMarker,
    })(PortfolioChart)