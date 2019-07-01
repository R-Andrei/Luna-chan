//global
export interface Generic {
    [property_name : string]: string;
}

//core/logging/logger.active.ts
export interface Actions {
    [property_name: string]: {
        activity: string,
        subject: string
    }
}

//core/storage/luna.transactions.ts
export interface ServerRecord {
    _id: number,
    type: string,
    name: string,
    members: number,
    owner_name: string,
    owner_tag: string,
    created: number,
    joined: number
}
export interface SetServerRecord {
    $set: ServerRecord
}
export interface AbilityRecord {
    _id: number,
    user: string,
    user_id: number,
    channel: string,
    server: string,
    server_id: number,
    ability: string,
    timestamp: number
}

//core/abilities
class AbilityType {
    public type: string;
}
export class Active extends AbilityType {
    constructor(public type: string = 'Active') {
        super();
    }
}
export class Passive extends AbilityType {
    constructor(public type: string = 'Passive') {
        super();
    }
}
class SubType {
    public type: string;
}
export class Main extends SubType {
    constructor(public type: string = 'Main') {
        super();
    }
}
export class Fake extends SubType {
    constructor(public type: string = 'Fake') {
        super();
    }
}
export const active = new Active();
export const passive = new Passive();
export const main = new Main();
export const fake = new Fake();