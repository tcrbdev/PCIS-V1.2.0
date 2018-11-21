import React, {Component} from 'react'
import {Icon, Divider, Menu} from 'antd'

import styles from './index.scss'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class ContextMenu extends Component {
    state = {
        visible: false
    };

    handleClick(e) {
        console.log('click', e);
    }

    componentDidMount() {
        document.addEventListener('contextmenu', this._handleContextMenu);
        document.addEventListener('click', this._handleClick);
        document.addEventListener('scroll', this._handleScroll);
    };

    componentWillUnmount() {
        document.removeEventListener('contextmenu', this._handleContextMenu);
        document.removeEventListener('click', this._handleClick);
        document.removeEventListener('scroll', this._handleScroll);
    }

    _handleContextMenu = (event) => {
        event.preventDefault();

        this.setState({visible: true});

        const clickX = event.clientX;
        const clickY = event.clientY;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const rootW = this.root.offsetWidth;
        const rootH = this.root.offsetHeight;

        const right = (screenW - clickX) > rootW;
        const left = !right;
        const top = (screenH - clickY) > rootH;
        const bottom = !top;

        if (right) {
            this.root.style.left = `${clickX + 5}px`;
        }

        if (left) {
            this.root.style.left = `${clickX - rootW - 5}px`;
        }

        if (top) {
            this.root.style.top = `${clickY + 5}px`;
        }

        if (bottom) {
            this.root.style.top = `${clickY - rootH - 5}px`;
        }
    };

    _handleClick = (event) => {
        const {visible} = this.state;
        const wasOutside = !(event.target.contains === this.root);

        if (wasOutside && visible) 
            this.setState({visible: false});
        };
    
    _handleScroll = () => {
        const {visible} = this.state;

        if (visible) 
            this.setState({visible: false});
        };
    
    render() {
        const {visible} = this.state;
        const {onClick, item} = this.props;
        console.log(item)

        return (visible || null) && <div
            ref={ref => {
            this.root = ref
        }}
            className={styles['contextMenu']}>
            <Menu
                onClick={this.handleClick}
                style={{
                width: '100%',
                height: '100%',
                maxWidth: '100%'
            }}
                mode="vertical">
                <Menu.Item key="1" onClick={() => onClick('ShowRouteInfo', item)}>
                    <Icon type="mail"/>
                    Show route Info
                </Menu.Item>
            </Menu>
        </div>
    };
}

export default ContextMenu
