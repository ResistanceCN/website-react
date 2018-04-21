import './Loading.css';
import React, { StatelessComponent } from 'react';
import { Spin } from 'antd';

interface LoadingProps {
    size?: 'small' | 'default' | 'large';
    className?: string;
}

const Loading: StatelessComponent<LoadingProps> = props => {
    return <div className={props.className + ' flex-spacer fluid-loading'}><Spin size={props.size} /></div>;
};

export default Loading;
