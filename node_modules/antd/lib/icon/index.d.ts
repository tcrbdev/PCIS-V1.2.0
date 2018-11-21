import * as React from 'react';
import createFromIconfontCN from './IconFont';
import { getTwoToneColor, setTwoToneColor } from './twoTonePrimaryColor';
export interface CustomIconComponentProps {
    width: string | number;
    height: string | number;
    fill: string;
    viewBox?: string;
    className?: string;
    style?: React.CSSProperties;
    ['aria-hidden']?: string;
}
export declare type ThemeType = 'filled' | 'outlined' | 'twoTone';
export interface IconProps {
    type?: string;
    className?: string;
    theme?: ThemeType;
    title?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
    component?: React.ComponentType<CustomIconComponentProps>;
    twoToneColor?: string;
    viewBox?: string;
    spin?: boolean;
    style?: React.CSSProperties;
    prefixCls?: string;
}
declare const Icon: React.SFC<IconProps>;
export declare type IconType = typeof Icon & {
    createFromIconfontCN: typeof createFromIconfontCN;
    getTwoToneColor: typeof getTwoToneColor;
    setTwoToneColor: typeof setTwoToneColor;
};
declare const _default: IconType;
export default _default;
