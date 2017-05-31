import React, { Component } from 'react'

class CustomerInfo extends Component {
    componentWillMount() {
        console.log("Customer Info : ", this.props)
    }
    render() {
        return (
            <div>this's my another page child.</div>
        )
    }
}

export default CustomerInfo