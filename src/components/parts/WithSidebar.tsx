import React from 'react';
import { Col, Row } from 'antd';
import Sidebar from './Sidebar';
import DefaultSidebar from './DefaultSidebar';

interface WithSidebarProps {
    children?: React.ReactNode;
    sidebar?: React.ReactNode;
    className?: string;
}

const WithSidebar = (props: WithSidebarProps) => (
    <Row>
        <Col span={16} className={(props.className || '') + ' main-content'}>
            {props.children}
        </Col>

        <Sidebar>
            {props.sidebar || <DefaultSidebar />}
        </Sidebar>
    </Row>
);

export default WithSidebar;
