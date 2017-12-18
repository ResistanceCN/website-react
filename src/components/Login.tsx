import './Login.scss';
import React from 'react';
import { User } from '../types';
import { State } from '../reducers';
import { GOOGLE_SIGNED_IN, LOGIN_SUCCESS } from '../actions';
import { connect, Dispatch } from 'react-redux';
import { Redirect, RouteProps } from 'react-router';
import { Card } from 'antd';
import { signin2 } from '../libs/googleAuth2';

interface LoginProps {
    user: User | null;
    googleSignIn(googleUser: gapi.auth2.GoogleUser): void;
    login(user: User): void;
}

interface LoginState {
    gapiError: boolean;
}

class Login extends React.Component<LoginProps & RouteProps, LoginState> {
    state = {
        gapiError: false
    };

    onSuccess(googleUser: gapi.auth2.GoogleUser) {
        this.props.googleSignIn(googleUser);

        // Perform AJAX request here
        localStorage.authToken = 'response.token goes here';

        const user: User = {
            id: 2,
            googleId: googleUser.getId(),
            name: googleUser.getBasicProfile().getName(),
            faction: 0
        };

        if (user.id !== 0) {
            this.props.login(user);
        } else {
            // Show register form
        }
    }

    onFailure() {
        this.setState({
            gapiError: true
        });
    }

    componentDidMount() {
        signin2().then(api => {
            api.render('google-sign-in-button', {
                scope: 'profile email',
                height: 36,
                longtitle: true,
                theme: 'dark',
                onsuccess: user => this.onSuccess(user),
                onfailure: () => this.onFailure()
            });
        }).catch(() => {
            this.onFailure();
        });
    }

    render() {
        if (this.props.user !== null) {
            const { from } = this.props.location!.state || { from: '/' };
            return <Redirect to={from} />;
        }

        return (
            <div className="flex-spacer container login-container">
                <Card bordered={false} title="登录">
                    <p>使用 Google 账户登录后，可以进行发表文章、参与投票、申请加入社群等操作。</p>
                    <p>用于登录的 Google 账户<b>并非</b>必须是你的 Ingress 账户。</p>

                    {this.state.gapiError ?
                        <div className="gapi-error">Google 登录组件加载失败</div>
                    :
                        <div id="google-sign-in-button" />
                    }
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state: State) => ({
    user: state.auth.user
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
    googleSignIn(googleUser: gapi.auth2.GoogleUser) {
        dispatch({
            type: GOOGLE_SIGNED_IN,
            googleUser
        });
    },
    login(user: User) {
        dispatch({
            type: LOGIN_SUCCESS,
            user
        });
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
