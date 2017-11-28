import { combineReducers } from 'redux';
import { auth, AuthState } from './auth';

export interface State {
    auth: AuthState;
}

export const reducer = combineReducers<State>({
    auth
});
