import { Action } from 'redux';
import { DISABLE_IMMERSIVE, ENABLE_IMMERSIVE } from '../actions';

export interface UIState {
    immersive: boolean;
}

const initAuthState: UIState = {
    immersive: false
};

interface AuthAction extends Action {
    //
}

export function ui(state: UIState = initAuthState, action: AuthAction): UIState {
    switch (action.type) {
        case ENABLE_IMMERSIVE:
            return {
                immersive: true
            };

        case DISABLE_IMMERSIVE:
            return {
                immersive: false
            };

        default:
            return state;
    }
}
