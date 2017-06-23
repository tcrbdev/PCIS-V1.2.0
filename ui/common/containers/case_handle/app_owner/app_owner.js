import React, { Component } from 'react'
import AppOwnerForm from '../../../components/case_handle/app_owner/app_owner'

class AppOwnerContainer extends Component {

    state = {
        visible: false,
        multiField: false,
        modalOpen: false,
        modalMode: null
    }

    handleSourceField = (e) => {
        const { value } = e.target;
        const { visible } = this.state
        this.setState({ visible: (value) == 'BM' ? true : false });
    }

    handleSourceCustomer = (value) => {
        this.setState({ multiField: (value) == 'TLA' ? true : false });
    }

    modalHandle = (e) => {
        this.setState({ modalOpen: true, modalMode: e.currentTarget.dataset.mode })
    }

    modalCommit = (e) => {
        this.setState({ modalOpen: false });
    }

    modalCancel = (e) => {
        this.setState({ modalOpen: false });
    }

    render() {
        return (
            <AppOwnerForm
                visible={this.state.visible}
                multiField={this.state.multiField}
                modalOpen={this.state.modalOpen}
                modalMode={this.state.modalMode}
                handleSource={this.handleSourceField}
                handleChanel={this.handleSourceCustomer}
                modalHandle={this.modalHandle}
                modalCommit={this.modalCommit}
                modalCancel={this.modalCancel}
            />
        )
    }

}


export default AppOwnerContainer