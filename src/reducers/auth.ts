import { Action } from 'redux';
import { User } from '../types';
import { AUTH_LOGIN, AUTH_LOGOUT, GOOGLE_SIGN_IN, GOOGLE_SIGN_OUT, SET_USER_TOKEN } from '../actions/types';

export interface AuthState {
    googleUser: gapi.auth2.GoogleUser | null;
    user: User | null;
    token: string;
}

const initAuthState: AuthState = {
    googleUser: null,
    user: null,
    token: ''
};

interface AuthAction extends Action {
    googleUser: gapi.auth2.GoogleUser;
    user: User;
    token: string;
}

export function auth(state: AuthState = initAuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case AUTH_LOGIN:
            return {
                ...state,
                user: action.user
            };

        case AUTH_LOGOUT:
            return {
                ...state,
                user: null
            };

        case GOOGLE_SIGN_IN:
            return {
                ...state,
                googleUser: action.googleUser
            };

        case GOOGLE_SIGN_OUT:
            return {
                ...state,
                googleUser: null
            };

        case SET_USER_TOKEN:
            return {
                ...state,
                token: action.token
            };

        default:
            return state;
    }
}
