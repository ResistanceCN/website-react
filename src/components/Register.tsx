import './Register.scss';
import React, { FormEvent } from 'react';
import { User } from '../types';
import { State } from '../reducers';
import { connect, Dispatch } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router';
import { Alert, Button, Card, Form, Icon, Input, Radio } from 'antd';
import gql from 'graphql-tag';
import { client as apollo } from '../apollo';
import { AUTH_RESET, LOGIN_SUCCESS } from '../actions';
import { errorText } from '../libs/utils';
import { auth2, googleSignOut } from '../libs/googleAuth2';

interface LoginProps extends RouteComponentProps<{}> {
    user: User | null;
    googleUser: gapi.auth2.GoogleUser | null;
    googleSignIn(googleUser: gapi.auth2.GoogleUser): void;
    login(user: User): void;
    logout(): void;
}

interface LoginState {
    name: string;
    faction: number;
    error: string;
}

interface BindingEvent {
    target: {
        name?: string;
        value?: string;
    };
}

class Register extends React.Component<LoginProps, LoginState> {
    state = {
        name: '',
        faction: 1,
        error: ''
    };

    async logout() {
        // Perform AJAX request here
        localStorage.authToken = '';

        auth2()
            .then(async api => await googleSignOut(api))
            .catch(() => 0) // Do nothing
            .then(() => this.props.logout()); // Always
    }

    async onSubmit(e: FormEvent<HTMLElement>) {
        e.preventDefault();

        try {
            const result = await apollo.mutate<{ me: User }>({
                mutation: gql`
                    mutation ($name: String!, $faction: Int!) {
                        me: createProfile(name: $name, faction: $faction) {
                            id
                            googleId
                            name
                            faction
                            emailHash
                            isAdmin
                        }
                    }
                `,
                variables: {
                    name: this.state.name,
                    faction: this.state.faction
                }
            });

            this.props.login(result.data!.me);
        } catch (e) {
            this.setState({
                ...this.state,
                error: errorText(e)
            });
        }
    }

    handleChange(e: BindingEvent) {
        this.setState({
            ...this.state,
            [e.target.name!]: e.target.value
        });
    }

    render() {
        const { user } = this.props;
        if (user !== null) {
            const { from } = this.props.location!.state || { from: '/user/' + user.id };
            return <Redirect to={from} />;
        }

        if (localStorage.authToken === '') {
            return <Redirect to="/login" />;
        }

        return (
            <div className="flex-spacer container login-container register-container">
                <Card bordered={false} title="完善您的资料">
                    <Form onSubmit={e => this.onSubmit(e)} className="join-form">
                        <Alert message="注意：以下信息提交后不可修改！" type="info" />

                        {this.state.error === '' ? '' : (
                            <Alert message={this.state.error} type="error" closable />
                        )}

                        <Form.Item label="特工代号">
                            <Input
                                name="name"
                                prefix={<Icon type="user" />}
                                placeholder="Agent Codename"
                                value={this.state.name}
                                onChange={e => this.handleChange(e)}
                            />
                        </Form.Item>

                        <Form.Item label="阵营">
                            <Radio.Group
                                className="radios-faction"
                                name="faction"
                                value={this.state.faction}
                                onChange={e => this.handleChange(e)}
                            >
                                <Radio.Button className="res" value={1}>抵抗军</Radio.Button>
                                <Radio.Button className="enl" value={2}>启蒙军</Radio.Button>
                                <Radio.Button className="none" value={0}>保密</Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        <div className="form-action">
                            <div className="flex-spacer" />
                            <Button onClick={() => this.logout()}>取消</Button>
                            <Button htmlType="submit" type="primary">提交</Button>
                        </div>
                    </Form>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state: State) => ({
    user: state.auth.user,
    googleUser: state.auth.googleUser
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
    login(user: User) {
        dispatch({
            type: LOGIN_SUCCESS,
            user
        });
    },
    logout() {
        dispatch({
            type: AUTH_RESET
        });
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Register);
