import React, { Component } from 'react'
import { Icon } from 'antd'
import _ from 'lodash'

const new_script = (src) => {
    return new Promise(function (resolve, reject) {
        let script = document.createElement('script')
        script.src = src
        script.addEventListener('load', function () {
            resolve()
        });
        script.addEventListener('error', function (e) {
            reject(e)
        });
        document.body.appendChild(script)
    })
};
// Promise Interface can ensure load the script only once.
const gapi = new_script('https://maps.googleapis.com/maps/api/js?key=AIzaSyAUC1Wou6aP9PPGzh8vXMlCD_xKEh739JQ&libraries=geometry,drawing,places&language=th&sensor=true');

class HOCScript extends Component {
    constructor(props) {
        super(props)
        this.state = {
            status: 'start'
        }
    }

    do_load = () => {
        let self = this
        gapi.then(function () {
            self.setState({ 'status': 'done' })
        }).catch(function () {
            self.setState({ 'status': 'error' })
        })
    }

    render() {
        let self = this

        let tag_script = document.getElementsByTagName('script')

        if (self.state.status === 'start') {
            self.state.status = 'loading'
            setTimeout(function () {
                self.do_load()
            }, 0);
        }

        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div style={{ width: '100%', height: '100%' }}>
                    {
                        self.state.status == 'error' ?
                            <div style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                paddingBottom: '200px'
                            }}>
                                <Icon type="exclamation-circle" style={{ marginBottom: '15px', fontSize: '35px', color: '#F44336' }} />
                                <span>Have trouble loading Google Map please try again later.</span>
                                <span>Or press F5 on keyboard for refresh this's page.</span>
                                <span style={{ marginTop: '15px', fontSize: '14px', color: '#009688' }} >(But search data is ready to use.)</span>
                                <span style={{ marginTop: '15px', fontSize: '16px', color: '#F44336' }} >We are sorry for inconvenience.</span>
                            </div>
                            :
                            this.props.children
                    }
                </div>
            </div>
        )
    }
}

export default HOCScript