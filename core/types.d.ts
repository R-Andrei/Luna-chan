export interface Generic {
    [property_name: string]: string;
}
export interface Actions {
    [property_name: string]: {
        activity: string;
        subject: string;
    };
}
export interface ServerRecord {
    _id: number;
    type: string;
    name: string;
    members: number;
    owner_name: string;
    owner_tag: string;
    created: number;
    joined: number;
}
export interface SetServerRecord {
    $set: ServerRecord;
}
export interface AbilityRecord {
    _id: number;
    user: string;
    user_id: number;
    channel: string;
    server: string;
    server_id: number;
    ability: string;
    timestamp: number;
}
declare class AbilityType {
    type: string;
}
export declare class Active extends AbilityType {
    type: string;
    constructor(type?: string);
}
export declare class Passive extends AbilityType {
    type: string;
    constructor(type?: string);
}
declare class SubType {
    type: string;
}
export declare class Main extends SubType {
    type: string;
    constructor(type?: string);
}
export declare class Fake extends SubType {
    type: string;
    constructor(type?: string);
}
export declare const active: Active;
export declare const passive: Passive;
export declare const main: Main;
export declare const fake: Fake;
export {};
