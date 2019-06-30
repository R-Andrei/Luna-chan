import StorageWorker from './storage/luna.transactions';
import Logger from './logging/logger.active';
declare class Luna {
    client: any;
    actives: any;
    passives: any;
    logger: Logger;
    storage: StorageWorker;
    constructor();
    wake_up(): void;
    init_abilities(): void;
    init_listeners(): void;
    add_event_listener(listener: () => void): void;
}
export = Luna;
