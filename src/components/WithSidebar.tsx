import React from 'react';
import { Col, Row } from 'antd';
import Sidebar from './Sidebar';

interface WithSidebarProps {
    children?: React.ReactNode;
    className: string;
}

export default (props: WithSidebarProps) => (
    <Row>
        <Col span={16} className={props.className}>
            {props.children}
        </Col>

        <Sidebar />
    </Row>
);
