import React, { Component, PropTypes } from 'react'
import { Upload, Icon, Collapse, Badge, Row, Col, message } from 'antd'
import FilesDesc from './files_desc'

const Dragger = Upload.Dragger
const Panel = Collapse.Panel

class FilesUpload extends Component {

    PropTypes = {
        files: PropTypes.array.isRequired,
        config: PropTypes.object.isRequired
    }

    render() {

        const { files, config } = this.props

        return (
            <article>
                <h4 className="pad5">Files Management</h4>
                <section>
                    <Collapse bordered={false} defaultActiveKey={['1']}>
                        <Panel header={<h4>Files Preview</h4>} key="1">
                            <Row type="flex" justify="start">
                                {
                                    files.map((file) => (<FilesDesc files={file} />))
                                }
                            </Row>
                        </Panel>
                    </Collapse>
                </section>
                <section>
                    <Collapse bordered={false} defaultActiveKey={['1']}>
                        <Panel header={<h4>Files Preview</h4>} key="1">
                            <Dragger {...config} style={{ minHeight: '250px' }}>
                                <p className="ant-upload-drag-icon marg_top10"><Icon type="inbox" /></p>
                                <p className="ant-upload-text marg_bottom10">Click or drag file to this area to upload</p>
                            </Dragger>
                        </Panel>
                    </Collapse>
                </section>

            </article>

        )
    }

}

export default FilesUpload