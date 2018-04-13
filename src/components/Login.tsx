import './Login.scss';
import React from 'react';
import { User } from '../types';
import { State } from '../reducers';
import { GOOGLE_SIGNED_IN, LOGIN_SUCCESS } from '../actions';
import { connect, Dispatch } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router';
import { Card } from 'antd';
import gql from 'graphql-tag';
import apollo from '../apollo';
import { signin2 } from '../libs/googleAuth2';

interface LoginProps extends RouteComponentProps<{}> {
    user: User | null;
    googleSignIn(googleUser: gapi.auth2.GoogleUser): void;
    login(user: User): void;
}

interface LoginState {
    gapiError: boolean;
    newUser: boolean;
}

class Login extends React.Component<LoginProps, LoginState> {
    state = {
        gapiError: false,
        newUser: false
    };

    async onSuccess(googleUser: gapi.auth2.GoogleUser) {
        this.props.googleSignIn(googleUser);

        const idToken = googleUser.getAuthResponse().id_token;
        const response = await fetch(process.env.REACT_APP_API_ENDPOINT + '/auth?google_token=' + idToken);
        const data = await response.json();

        localStorage.authToken = data.token;

        if (data.newUser) {
            return this.setState({
                ...this.state,
                newUser: true
            });
        }

        const result = await apollo.query<{ me: User }>({
            query: gql`
                query {
                    me { id name faction }
                }
            `
        });

        const user = {
            ...result.data.me,
            googleId: googleUser.getId()
        };

        this.props.login(user);
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

        if (this.state.newUser) {
            return <Redirect to="/register" />;
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
