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