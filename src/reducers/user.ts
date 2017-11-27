import { Action } from 'redux';
import { User, Faction } from '../types';
import { USER_LOGIN, USER_LOGOUT } from '../actions/types';

export interface UserState extends User {}

const initUserState: UserState = {
    id: 0,
    googleId: '',
    name: 'Guest',
    faction: Faction.Unspecified
};

interface UserAction extends Action {
    user: UserState;
}

export function user(state: UserState = initUserState, action: UserAction): UserState {
    switch (action.type) {
        case USER_LOGIN:
            return {
                ...action.user
            };

        case USER_LOGOUT:
            return {
                ...initUserState
            };

        default:
            return state;
    }
}
