import { Action } from 'redux';
import { User } from '../types';
import { AUTH_RESET, GOOGLE_SIGNED_IN, LOGIN_SUCCESS } from '../actions';

export interface AuthState {
    googleUser: gapi.auth2.GoogleUser | null;
    user: User | null;
}

const initAuthState: AuthState = {
    googleUser: null,
    user: null
};

interface AuthAction extends Action {
    googleUser: gapi.auth2.GoogleUser;
    user: User;
}

export function auth(state: AuthState = initAuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case AUTH_RESET:
            return {
                googleUser: null,
                user: null
            };

        case GOOGLE_SIGNED_IN:
            return {
                ...state,
                googleUser: action.googleUser
            };

        case LOGIN_SUCCESS:
            return {
                ...state,
                user: action.user
            };

        default:
            return state;
    }
}
