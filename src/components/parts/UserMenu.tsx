import './UserMenu.scss';
import React from 'react';
import { User } from '../../types';
import { State } from '../../reducers';
import { AUTH_RESET } from '../../actions';
import { connect, Dispatch } from 'react-redux';
import { Avatar, Button, Dropdown, Menu } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { resizeGoogleAvatar } from '../../libs/utils';
import { auth2 } from '../../libs/googleAuth2';

interface UserMenuProps extends RouteComponentProps<{}> {
    user: User;
    logout(): void;
}

class UserMenu extends React.Component<UserMenuProps> {
    logout = () => {
        // Perform AJAX request here
        localStorage.authToken = '';

        auth2
            .then(api => api.getAuthInstance().signOut())
            .catch(() => 0) // Do nothing
            .then(this.props.logout); // Always
    };

    render() {
        const { user } = this.props;

        if (user === null) {
            return (
                <Link to={{ pathname: '/login', state: { from: location.pathname } }}>
                    <Button type="dashed" className="login-btn">
                        登录
          </Button>
                </Link>
            );
        }

        return (
            <Dropdown
                trigger={['click']}
                placement="bottomRight"
                overlay={
                    <Menu>
                        <Menu.Item>Signed in as {user.name}</Menu.Item>
                        <Menu.Divider />
                        <Menu.Item>
                            <Link to={'/user/' + user.id}>个人主页</Link>
                        </Menu.Item>
                        <Menu.Item>
                            <a onClick={this.logout}>注销</a>
                        </Menu.Item>
                    </Menu>
                }
            >
                {user.avatar ? (
                    <Avatar
                        className="user-avatar"
                        src={resizeGoogleAvatar(user.avatar, 32)}
                    />
                ) : (
                        <Avatar className="user-avatar" icon="user" />
                    )}
            </Dropdown>
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

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(UserMenu)
);
