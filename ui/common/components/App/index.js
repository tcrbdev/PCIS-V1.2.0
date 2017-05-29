import React, { Component } from 'react'

import styles from './index.scss'


class App extends Component {
    render() {
        return (
            <div className={styles['app-container']}>
                <header className={styles['header']}></header>
                <div className={styles['body-container']}>
                    <h1 className={styles['h1']}>Hello World</h1>
                    {this.props.children}
                </div>
            </div>
        )
    }

}

export default App
