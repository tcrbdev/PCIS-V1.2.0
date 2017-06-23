import React, { Component } from 'react'
import Scrollbar from 'react-smooth-scrollbar';
import { Link } from 'react-router'
import { Icon, Button } from 'antd';
import styles from './index.scss'

export default class Index extends Component {
    render() {
        return (
            <div className={styles['app-container']}>
                <header className={styles['header']}>
                    <Button type="primary" style={{ marginRight: '10px' }} onClick={this.props.router.goBack}>Back</Button>
                    <Button type="primary"
                        shape="circle"
                        icon="shopping-cart"
                        onClick={(event) => { event.preventDefault(); window.open('http://tc001pcis1p/nanomarket/'); }} ></Button>
                </header>
                <div className={styles['body-container']}>
                    <Scrollbar style={{ height: '100%' }} overscrollEffect="bounce">
                        {this.props.children}
                    </Scrollbar>
                </div>
            </div >
        )
    }
}

