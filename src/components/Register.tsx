import './Register.scss';
import React, { ChangeEvent, FormEvent } from 'react';
import { User } from '../types';
import { State } from '../reducers';
import { connect, Dispatch } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router';
import { Alert, Button, Card, Form, Icon, Input, Radio } from 'antd';
import gql from 'graphql-tag';
import apollo from '../apollo';
import { LOGIN_SUCCESS } from '../actions';

interface LoginProps extends RouteComponentProps<{}> {
    user: User | null;
    googleUser: gapi.auth2.GoogleUser | null;
    googleSignIn(googleUser: gapi.auth2.GoogleUser): void;
    login(user: User): void;
}

interface LoginState {
    name: string;
    faction: number;
    error: string;
}

class Register extends React.Component<LoginProps, LoginState> {
    state = {
        name: '',
        faction: 1,
        error: ''
    };

    async onSubmit(e: FormEvent<HTMLElement>) {
        e.preventDefault();

        try {
            const result = await apollo.mutate<{ me: User }>({
                mutation: gql`
                    mutation ($name: String, $faction: Int) {
                        me: createProfile(name: $name, faction: $faction) {
                            id
                            googleId
                            name
                            faction
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
                error: e.toString().replace('Error: GraphQL error: ', '')
            });
        }
    }

    handleChange(e: ChangeEvent<{}>) {
        const el = e.target as HTMLParamElement;
        this.setState({
            ...this.state,
            [el.name]: el.value
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
                                size="large"
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

                        <Button htmlType="submit" size="large" type="primary">提交</Button>
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
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Register);