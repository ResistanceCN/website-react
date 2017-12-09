import './Admin.scss';
import React from 'react';
import { Icon, Layout, Menu } from 'antd';
import { Route } from 'react-router';
import { Link, Switch } from 'react-router-dom';
import Overview from './Overview';
import ExampleTable from './ExampleTable';

const { Sider } = Layout;
const { SubMenu } = Menu;

export default class Admin extends React.Component {
    render() {
        let current = location.pathname.substr(7).split('/')[0];

        if (current === '') {
            current = 'overview';
        }

        return (
            <Layout className="flex-spacer panel-layout">
                <Sider>
                    <Menu
                        mode="inline"
                        selectedKeys={[current]}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%' }}
                    >
                        <SubMenu key="sub1" title={<span><Icon type="user" />subnav 1</span>}>
                            <Menu.Item key="overview"><Link to="/admin">Overview</Link></Menu.Item>
                            <Menu.Item key="table"><Link to="/admin/table">Example Table</Link></Menu.Item>
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
                </Sider>
                <div className="flex-spacer container-fluid panel-container">
                    <Switch>
                        <Route exact path="/admin" component={Overview} />
                        <Route path="/admin/table" component={ExampleTable} />
                    </Switch>
                </div>
            </Layout>
        );
    }
}
