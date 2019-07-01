import { Generic } from '../types';
import { Message, Guild } from 'discord.js';
import { Ability } from '../abilities/template.ability';
export declare class StorageWorker {
    database_name: string;
    collections: Generic;
    private address;
    private client;
    private database;
    constructor(user: string, token: string, address: string, database: string, collections: Generic);
    open_connection(): Promise<string>;
    update_ability(message: Message, ability: Ability): Promise<string>;
    update_server(server: Guild, record_type: string): Promise<string>;
    close_connection(): Promise<string>;
}
