import * as React from 'react';
import * as PropTypes from 'prop-types';
declare type EventType = React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>;
declare type getContainerfunc = () => HTMLElement;
declare type placementType = 'top' | 'right' | 'bottom' | 'left';
export interface DrawerProps {
    closable?: boolean;
    destroyOnClose?: boolean;
    getContainer?: string | HTMLElement | getContainerfunc;
    maskClosable?: boolean;
    mask?: boolean;
    maskStyle?: React.CSSProperties;
    style?: React.CSSProperties;
    title?: React.ReactNode;
    visible?: boolean;
    width?: number | string;
    height?: number | string;
    wrapClassName?: string;
    zIndex?: number;
    prefixCls?: string;
    push?: boolean;
    placement?: placementType;
    onClose?: (e: EventType) => void;
    className?: string;
}
export interface IDrawerState {
    push?: boolean;
}
export default class Drawer extends React.Component<DrawerProps, IDrawerState> {
    static propTypes: {
        closable: PropTypes.Requireable<boolean>;
        destroyOnClose: PropTypes.Requireable<boolean>;
        getContainer: PropTypes.Requireable<string | boolean | object>;
        maskClosable: PropTypes.Requireable<boolean>;
        mask: PropTypes.Requireable<boolean>;
        maskStyle: PropTypes.Requireable<object>;
        style: PropTypes.Requireable<object>;
        title: PropTypes.Requireable<React.ReactNode>;
        visible: PropTypes.Requireable<boolean>;
        width: PropTypes.Requireable<string | number>;
        zIndex: PropTypes.Requireable<number>;
        prefixCls: PropTypes.Requireable<string>;
        placement: PropTypes.Requireable<string>;
        onClose: PropTypes.Requireable<(...args: any[]) => any>;
        className: PropTypes.Requireable<string>;
    };
    static defaultProps: {
        prefixCls: string;
        width: number;
        height: number;
        closable: boolean;
        placement: string;
        maskClosable: boolean;
        level: null;
    };
    readonly state: {
        push: boolean;
    };
    parentDrawer: Drawer;
    destoryClose: boolean;
    componentDidUpdate(preProps: DrawerProps): void;
    close: (e: EventType) => void;
    onMaskClick: (e: EventType) => void;
    push: () => void;
    pull: () => void;
    onDestoryTransitionEnd: () => void;
    getDestoryOnClose: () => boolean | undefined;
    getPushTransform: (placement?: "bottom" | "left" | "right" | "top" | undefined) => string | undefined;
    renderBody: () => JSX.Element | null;
    getRcDrawerStyle: () => {
        zIndex: number | undefined;
        transform: string | undefined;
    } | {
        zIndex: number | undefined;
        transform?: undefined;
    };
    renderProvider: (value: Drawer) => JSX.Element;
    render(): JSX.Element;
}
export {};
