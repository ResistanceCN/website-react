import { USER_LOGIN, USER_LOGOUT } from './types';
import { Faction } from '../types/Faction';

export function checkUser() {
    // Check user status with localStorage.userToken after app loaded
    // Perform AJAX request here

    return {
        type: USER_LOGIN,
        user: {
            id: 1,
            googleId: '123',
            name: 'Test User',
            faction: Faction.Resistance
        }
    };
}

export function userLogin() {
    // Perform AJAX request here

    localStorage.userToken = 'abc123';

    return {
        type: USER_LOGIN,
        user: {
            id: 2,
            googleId: '123',
            name: 'Test User 2',
            faction: Faction.Resistance
        }
    };
}

export function userLogout() {
    // Perform AJAX request here

    return {
        type: USER_LOGOUT
    };
}
