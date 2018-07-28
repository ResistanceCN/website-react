import { Faction } from './Faction';

export interface User {
    id: string;
    googleId: string;
    name: string;
    avatar: string;
    faction: Faction;
    isAdmin: boolean;
}

export const nullUser: User = {
    id: '',
    googleId: '',
    name: '',
    faction: Faction.Unspecified,
    avatar: '',
    isAdmin: false
};
