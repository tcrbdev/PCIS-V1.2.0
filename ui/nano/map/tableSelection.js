import React, { Component } from 'react'
import styles from './tableSelection.scss'

export default class TableSelection extends Component {

    state = {
        pointerIndex: ''
    }

    onOverDiv = (index) => {
        const rowIndex = index.split('_')[0]
        const colIndex = index.split('_')[1]
        this.setState({ pointerIndex: index })
    }


    onClickCell = index => {
        const rowIndex = index.split('_')[0]
        const colIndex = index.split('_')[1]

        console.log(`Row : ${rowIndex} , Coll : ${colIndex} , Element : ${rowIndex * colIndex}`)
    }

    checkClass = (rIndex, cIndex) => {
        const rowIndex = this.state.pointerIndex.split('_')[0]
        const colIndex = this.state.pointerIndex.split('_')[1]
        if (rIndex <= rowIndex && cIndex <= colIndex) {
            return styles['cell-selected']
        }
    }

    render() {
        let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

        return (
            <div className={styles['cell-container']}>
                {
                    array.map((r, rIndex) => {
                        return array.map((c, cIndex) => {
                            const pointer = `${rIndex + 1}_${cIndex + 1}`
                            const hilight = this.checkClass(rIndex + 1, cIndex + 1)
                            return (<div className={`${styles['cell']} ${hilight}`} ref={pointer} onMouseOver={() => this.onOverDiv(pointer)} onClick={() => this.onClickCell(pointer)}></div>)
                        })
                    })
                }
            </div>
        )
    }
}
