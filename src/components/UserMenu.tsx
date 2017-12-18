import './UserMenu.scss';
import React from 'react';
import { User } from '../types';
import { State } from '../reducers';
import { AUTH_RESET } from '../actions';
import { connect, Dispatch } from 'react-redux';
import { Avatar, Button, Dropdown, Menu } from 'antd';
import { RouteProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { auth2 } from '../libs/googleAuth2';

interface UserMenuProps {
    user: User;
    logout(): void;
}

class UserMenu extends React.Component<UserMenuProps & RouteProps> {
    async googleSignOut(api: typeof gapi.auth2) {
        return new Promise(resolve => {
            // Google says that the signOut() method is synchronous, but...
            api.getAuthInstance().signOut();

            // Perform AJAX request here
            localStorage.authToken = '';

            // isSignedIn is not set to false immediately, so we have to wait
            const wait = () => {
                if (api.getAuthInstance().isSignedIn.get() === false) {
                    // If we do logout() before isSignedIn changed, the user might be redirected to login page
                    // Then gapi.auth2.init() would call onSuccess(), which will dispatch actions we don't want
                    resolve();

                    return;
                }

                setTimeout(wait, 1);
            };

            wait();
        });
    }

    async logout() {
        auth2()
            .then(async api => await this.googleSignOut(api))
            .catch(() => 0) // Do nothing
            .then(() => this.props.logout()); // Always
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
            <Link to={{ pathname: '/login', state: { from: location.pathname }}}>
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

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(UserMenu));
