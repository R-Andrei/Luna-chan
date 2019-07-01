interface Collections {
    [property_name: string]: string;
}
declare class StorageWorker {
    address: string;
    database_name: string;
    collections: Collections;
    client: any;
    database: any;
    constructor(user: string, token: string, address: string, database: string, collections: Collections);
    open_connection(): Promise<string>;
    record_cast(message: any, ability: any): Promise<string>;
    update_server(server: any, record_type: any): Promise<string>;
    close_connection(): Promise<string>;
}
export = StorageWorker;
