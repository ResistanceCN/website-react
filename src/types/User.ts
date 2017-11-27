import { Faction } from "./Faction";

export interface User {
    id: number;
    googleId: string;
    name: string;
    faction: Faction;
}
