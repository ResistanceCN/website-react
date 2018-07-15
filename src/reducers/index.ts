import { combineReducers } from 'redux';
import { ui, UIState } from './ui';
import { auth, AuthState } from './auth';

export interface State {
    ui: UIState;
    auth: AuthState;
}

export const reducer = combineReducers<State>({
    ui,
    auth
});
