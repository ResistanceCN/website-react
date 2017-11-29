import './UserMenu.css';
import React from 'react';
import { User } from '../types';
import { State } from '../reducers';
import { connect, Dispatch } from 'react-redux';
import { authLogout } from '../actions/auth';
import { Avatar, Button, Dropdown, Menu } from 'antd';
import { Link } from 'react-router-dom';

interface UserMenuProps {
    user: User;
    logout(): void;
}

const UserMenu = (props: UserMenuProps) => {
    const { user, logout } = props;

    if (user === null) {
        return (
            <Link to="/login">
                <Button type="dashed" className="user-login">登录</Button>
            </Link>
        );
    }

    return (
        <Dropdown
            trigger={['click']}
            placement="bottomRight"
            overlay={(
                <Menu>
                    <Menu.Item>Signed in as {user.name}</Menu.Item>
                    <Menu.Divider/>
                    <Menu.Item>
                        <Link to={'/user/' + user.id}>个人主页</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <a target="_blank" rel="noopener noreferrer" href="#">控制台</a>
                    </Menu.Item>
                    <Menu.Divider/>
                    <Menu.Item>
                        <a target="_blank" rel="noopener noreferrer" href="#">设置</a>
                    </Menu.Item>
                    <Menu.Item><a onClick={logout}>注销</a></Menu.Item>
                </Menu>
            )}
        >
            <Avatar className="user-avatar" src="/assets/img/avatar-blue.jpg"/>
        </Dropdown>
    );
};

const mapStateToProps = (state: State) => ({
    user: state.auth.user
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
    logout() {
        dispatch(authLogout());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserMenu);
