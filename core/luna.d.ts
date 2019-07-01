import { Client, Collection, Snowflake } from 'discord.js';
import { StorageWorker } from './storage/luna.transactions';
import { Logger } from './logging/logger.active';
import { Ability } from './abilities/template.ability.js';
export declare class Luna {
    client: Client;
    abilities: Collection<Snowflake, Ability>;
    logger: Logger;
    storage: StorageWorker;
    constructor();
    wake_up(): void;
    init_abilities(): void;
    init_listeners(): void;
    add_event_listener(listener: () => void): void;
}
