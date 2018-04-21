import { Faction } from './Faction';

export interface User {
    id: string;
    googleId: string;
    name: string;
    faction: Faction;
    emailHash: string;
    isAdmin: boolean;
}

export const nullUser: User = {
    id: '',
    googleId: '',
    name: '',
    faction: Faction.Unspecified,
    emailHash: '',
    isAdmin: false
};
