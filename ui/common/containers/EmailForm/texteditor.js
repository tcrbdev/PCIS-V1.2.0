import React, { Component } from 'react'
import ReactQuill from 'react-quill'
import styles from './index.scss'

const CustomToolbar = () => (
    <div id="toolbar" className={styles['mail-form-toolbar']}>
        <select className="ql-header">
            <option value="1"></option>
            <option value="2"></option>
            <option value="3"></option>
            <option value="4"></option>
            <option selected></option>
        </select>
        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <select className="ql-color">
            <option value="rgb(117, 123, 128)"></option>
            <option value="rgb(189, 19, 152)"></option>
            <option value="rgb(114, 50, 173)"></option>
            <option value="rgb(0, 111, 201)"></option>
            <option value="rgb(75, 165, 36)"></option>
            <option value="rgb(226, 197, 1)"></option>
            <option value="rgb(208, 92, 18)"></option>
            <option value="rgb(255, 0, 0)"></option>
            <option value="rgb(255, 255, 255)"></option>
            <option selected value="rgb(0, 0, 0)"></option>
        </select>
        <select className="ql-background">
            <option value="rgb(117, 123, 128)"></option>
            <option value="rgb(189, 19, 152)"></option>
            <option value="rgb(114, 50, 173)"></option>
            <option value="rgb(0, 111, 201)"></option>
            <option value="rgb(75, 165, 36)"></option>
            <option value="rgb(226, 197, 1)"></option>
            <option value="rgb(208, 92, 18)"></option>
            <option value="rgb(255, 0, 0)"></option>
            <option value="rgb(255, 255, 255)"></option>
            <option selected value="rgb(0, 0, 0)"></option>
        </select>
    </div>
)

export default class TextEditor extends Component {

    render() {
        return (
            <div className={styles['mail-form']}>
                <div className={styles['mail-from-file']}>
                </div>
                <div>
                    <ReactQuill
                        className={styles['mail-form-text']}
                        theme="snow"
                        value={this.props.detail}
                        onChange={this.props.handleChange}
                        modules={
                            {
                                toolbar: {
                                    container: "#toolbar"
                                }
                            }
                        } >
                        <div />
                    </ReactQuill>
                </div>
                <div>
                    <CustomToolbar />
                </div>
            </div>
        )
    }
}