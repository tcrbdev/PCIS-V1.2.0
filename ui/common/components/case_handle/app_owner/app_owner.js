import React, { Component, PropTypes } from 'react'
import { Collapse, Row, Col, Tooltip } from 'antd'
import { AppOwnerFormItem, AppOwnerFormTool } from './modules'

const Panel = Collapse.Panel
class AppOwnerForm extends Component {

    PropTypes = {
        visible: PropTypes.bool.isRequired,
        multiField: PropTypes.bool.isRequired,
        modalOpen: PropTypes.bool.isRequired,
        handleSource: PropTypes.func.isRequired,
        handleChanel: PropTypes.func.isRequired,
        modalHandle: PropTypes.func.isRequired,
        modalCommit: PropTypes.func.isRequired,
        modalCancel: PropTypes.func.isRequired
    }

    render() {

        const {
            visible,
            multiField,
            modalOpen,
            modalMode,
            handleSource,
            handleChanel,
            modalHandle,
            modalCommit,
            modalCancel
        } = this.props

        return (
            <article id="case_handle_component">
                <Row>
                    <Col>
                        <Collapse bordered={true} defaultActiveKey={['1']}>
                            <Panel className="panel_darkCyan" header={<h4 className="text_upper fg_white">Information</h4>} key="1">
                                <AppOwnerFormItem
                                    visible={visible}
                                    multiField={multiField}
                                    handleSource={handleSource}
                                    handleChanel={handleChanel}
                                />
                                <AppOwnerFormTool
                                    modalOpen={modalOpen}
                                    modalMode={modalMode}
                                    modalHandle={modalHandle}
                                    modalCommit={modalCommit}
                                    modalCancel={modalCancel}
                                />
                            </Panel>
                        </Collapse>
                    </Col>
                </Row>
            </article>
        )
    }

}

export default AppOwnerForm