import React, { Component } from 'react'
import Scrollbar from 'react-smooth-scrollbar';

import styles from './index.scss'

export default class Index extends Component {
    render() {
        return (
            <div className={styles['app-container']}>
                <header className={styles['header']}></header>
                <div className={styles['body-container']}>
                    <Scrollbar style={{ height: '100%' }} overscrollEffect={true}>
                        {this.props.children}
                    </Scrollbar>
                </div>
            </div>
        )
    }
}

