import { Faction } from './Faction';

export interface User {
    id: string;
    googleId: string;
    name: string;
    faction: Faction;
    emailHash: string;
}
