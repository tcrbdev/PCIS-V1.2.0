import React, { Component, PropTypes } from 'react'
import { Row, Col, Icon } from 'antd'

class FilesDesc extends Component {

    PropTypes = {
        files: PropTypes.array.isRequired
    }

    render() {

        const { files } = this.props

        return (
            <Col span={5} className="marg_top10 text-center">
                <Icon type="file-unknown" className="fg_grayLight" style={{ fontSize: '6em' }} />
                <p className="bold">{files.name.split('.')[0]}</p>
                <p className="text_capital">Natthapong N.</p>
                <time>{ moment().format('DD/MM/YYYY HH:mm') }</time>
            </Col>
        )
    }

}

export default FilesDesc