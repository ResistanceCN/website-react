import './AdminPanel.scss';
import React from 'react';
import { Layout, Menu, Breadcrumb, Icon, Table, Card } from 'antd';

interface AdminToolsProps {
    icon: string;
    record: string;
}

const { SubMenu } = Menu;

const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
}, {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
}, {
    title: 'Address',
    dataIndex: 'address',
    key: 'address'
}, {
    title: 'Action',
    key: 'action'
}];

const data = [{
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park'
    }, {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park'
    }, {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park'
    }, {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park'
    }, {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park'
}];

export default class AdminPanel extends React.Component {
    render() {
        return (
            <div className="flex-spacer">
                <div className="sidebar">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%' }}
                    >
                        <SubMenu key="sub1" title={<span><Icon type="user" />subnav 1</span>}>
                            <Menu.Item key="1">option1</Menu.Item>
                            <Menu.Item key="2">option2</Menu.Item>
                            <Menu.Item key="3">option3</Menu.Item>
                            <Menu.Item key="4">option4</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" title={<span><Icon type="laptop" />subnav 2</span>}>
                            <Menu.Item key="5">option5</Menu.Item>
                            <Menu.Item key="6">option6</Menu.Item>
                            <Menu.Item key="7">option7</Menu.Item>
                            <Menu.Item key="8">option8</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub3" title={<span><Icon type="notification" />subnav 3</span>}>
                            <Menu.Item key="9">option9</Menu.Item>
                            <Menu.Item key="10">option10</Menu.Item>
                            <Menu.Item key="11">option11</Menu.Item>
                            <Menu.Item key="12">option12</Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
                <div className="container">
                    <Table columns={columns} dataSource={data} />
                    <Card className="chart">Some data analysis charts</Card>
                </div>
            </div>
        );
    }
}
