import './UserMenu.scss';
import React from 'react';
import { User } from '../types';
import { State } from '../reducers';
import { AUTH_RESET } from '../actions';
import { connect, Dispatch } from 'react-redux';
import { Avatar, Button, Dropdown, Menu } from 'antd';
import { Link } from 'react-router-dom';

interface UserMenuProps {
    user: User;
    logout(): void;
}

class UserMenu extends React.Component<UserMenuProps> {
    logout() {
        // Google says that the signOut() method is synchronous, but...
        gapi.auth2.getAuthInstance().signOut();

        // Perform AJAX request here
        // localStorage.authToken = '';

        // isSignedIn is not set to false immediately, so we have to wait
        const wait = () => {
            if (gapi.auth2.getAuthInstance().isSignedIn.get() === false) {
                // If we do this before isSignedIn changed, the user might be redirected to login page
                // Then gapi.auth2.init() would call onSuccess(), which will dispatch actions we don't want
                this.props.logout();

                return;
            }

            setTimeout(wait, 1);
        };

        wait();
    }

    componentDidMount() {
        if (typeof gapi === 'undefined') {
            throw new Error('Google oAuth library is not loaded');
        }
    }

    render() {
        const { user } = this.props;

        const isAdmin = true;

        if (user !== null) {
            return (
                <Dropdown
                    trigger={['click']}
                    placement="bottomRight"
                    overlay={(
                        <Menu>
                            <Menu.Item>Signed in as {user.name}</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item>
                                <Link to={'/user/' + user.id}>个人主页</Link>
                            </Menu.Item>
                            <Menu.Item>
                                <Link to="/settings">设置</Link>
                            </Menu.Item>
                            {isAdmin ? (
                                <Menu.Item>
                                    <Link to={'/admin'}>控制台</Link>
                                </Menu.Item>
                            ) : ''}
                            <Menu.Divider />
                            <Menu.Item><a onClick={() => this.logout()}>注销</a></Menu.Item>
                        </Menu>
                    )}
                >
                    <Avatar className="user-avatar" src="/assets/img/avatar-blue.jpg" />
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
