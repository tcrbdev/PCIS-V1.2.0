import React, { Component } from 'react'
import fetch from 'isomorphic-fetch'
import _ from 'lodash'
import { Icon } from 'antd'
import { columns } from './config/columns'
import { LOAD_ASSIGNMENT_GRID, LOAD_ASSIGNMENT_CHART } from '../../../constants/endpoints'
import AssignComponent from '../../../components/case_handle/assignment/assign_component'

class AppAssignmentContainer extends Component {

    state = {
        data: [],
        loadChart: null,
        loadGrid: true,
        modalOpen: false,
        reportOpen: false
    }

    reportHandle = () => {
        this.setState({ reportOpen: !this.state.reportOpen })
    }

    modalHandle = () => {
        this.setState({ modalOpen: true })
    }

    modalCommit = (e) => {
        this.setState({ modalOpen: false });
    }

    modalCancel = (e) => {
        this.setState({ modalOpen: false });
    }

    // GROUP: LIFE CYCLE METHOD
    componentDidMount() {
        fetch(LOAD_ASSIGNMENT_GRID)
            .then((responsed) => responsed.json())
            .then((data) => this.setState({ data, loadGrid: false }))
    }

    render() {

        _.filter(columns[1].children, { dataIndex: "cust_source" })[0].title        = (<Icon type="notification" />)
        _.filter(columns[1].children, { dataIndex: "cust_loaninterest" })[0].title  = (<Icon type="smile-o" />)
        _.filter(columns[1].children, { dataIndex: "cust_potential" })[0].title     = (<Icon type="solution" />)
        _.filter(columns[1].children, { dataIndex: "assign_tool" })[0]['render']    = () => { return (<Icon type="laptop" className="icon" onClick={this.modalHandle} />)}

        return (
            <AssignComponent
                columns={columns}
                data={this.state.data}
                loadGrid={this.state.loadGrid}
                modalOpen={this.state.modalOpen}
                modalCommit={this.modalCommit}
                modalCancel={this.modalCancel}
                reportOpen={this.state.reportOpen}
                reportHandle={this.reportHandle}
            />
        )
    }

}

export default AppAssignmentContainer