import { AUTH_LOGIN, AUTH_LOGOUT } from './types';
import { Faction } from '../types';

export function authCheck() {
    // Check user status with localStorage.userToken after app loaded
    // Perform AJAX request here

    return {
        type: AUTH_LOGIN,
        user: {
            id: 1,
            googleId: '123',
            name: 'Test User',
            faction: Faction.Resistance
        }
    };
}

export function authLogin() {
    // Perform AJAX request here

    localStorage.userToken = 'abc123';

    return {
        type: AUTH_LOGIN,
        user: {
            id: 2,
            googleId: '123',
            name: 'Test User 2',
            faction: Faction.Resistance
        }
    };
}

export function authLogout() {
    // Perform AJAX request here

    return {
        type: AUTH_LOGOUT
    };
}
