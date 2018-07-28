import React from 'react';
import { Col, Row } from 'antd';
import Sidebar from './Sidebar';
import DefaultSidebar from './DefaultSidebar';

interface WithSidebarProps {
    children?: React.ReactNode;
    sidebar?: React.ReactNode;
    className: string;
}

export default (props: WithSidebarProps) => (
    <Row>
        <Col span={16} className={props.className}>
            {props.children}
        </Col>

        <Sidebar>
            {props.sidebar || <DefaultSidebar />}
        </Sidebar>
    </Row>
);
