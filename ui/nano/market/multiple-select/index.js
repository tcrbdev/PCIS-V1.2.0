import React, { Component } from 'react'
import styles from './index.scss'

import { TreeSelect } from 'antd';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;

export default class Demo extends React.Component {

    render() {
        const tProps = {
            size: 'large',
            defaultValue: this.props.defaultValue,
            treeData: this.props.treeData,
            onChange: this.props.onChange,
            multiple: true,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: this.props.searchPlaceholder,
            treeDefaultExpandedKeys: ['0'],
            style: {
                width: '100%',
            }
        };
        return <TreeSelect {...tProps} />;
    }
}