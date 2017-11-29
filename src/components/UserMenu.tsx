import './UserMenu.scss';
import React from 'react';
import { User } from '../types';
import { State } from '../reducers';
import { connect, Dispatch } from 'react-redux';
import { AUTH_RESET } from '../actions';
import { Avatar, Button, Dropdown, Menu } from 'antd';
import { Link } from 'react-router-dom';

interface UserMenuProps {
    user: User;
    logout(): void;
}

class UserMenu extends React.Component<UserMenuProps> {
    logout() {
        gapi.auth2.getAuthInstance().disconnect();

        // Perform AJAX request here
        // localStorage.authToken = '';

        this.props.logout();
    }

    componentDidMount() {
        if (typeof gapi === 'undefined') {
            throw new Error('Google oAuth library is not loaded');
        }
    }

    render() {
        const { user } = this.props;

        if (user !== null) {
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
                            <Menu.Item><a onClick={() => this.logout()}>注销</a></Menu.Item>
                        </Menu>
                    )}
                >
                    <Avatar className="user-avatar" src="/assets/img/avatar-blue.jpg"/>
                </Dropdown>
            );
        }

        return (
            <Link to="/login">
                <Button type="dashed" className="login-btn">登录</Button>
            </Link>
        );
    }
}

const mapStateToProps = (state: State) => ({
    user: state.auth.user
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
    logout() {
        dispatch({
            type: AUTH_RESET
        });
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserMenu);
