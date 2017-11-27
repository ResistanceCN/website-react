import { combineReducers } from 'redux';
import { user, UserState } from './user';

export interface State {
    user: UserState;
}

export const reducer = combineReducers<State>({
    user
});
