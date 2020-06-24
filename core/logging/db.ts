import { MongoClient, Collection } from 'mongodb';

import { DB_NAME, DB_ADDRESS, DB_PORT } from '../../config';
import { LogRecord } from '../types';


export class Db { // TODO REMOVE LOGGING FUNCTIONALITY FROM LOGGER AND CHANGE TO DB CLASS

    private readonly uri: string = `mongodb://${DB_ADDRESS}:${DB_PORT}/${DB_NAME}`;

    private _client: MongoClient = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    private _db = null;

    public connect = async (): Promise<boolean> => {
        return new Promise((resolve, reject) => {

            this._client.connect()
                .then(client => {
                    this._client = client;
                    this._db = this._client.db()
                    resolve(true);
                })
                .catch(error => reject(error));
        });
    }

    public logAbility = async (log: LogRecord): Promise<boolean> => new Promise((resolve, reject) => {
        const collection: Collection = this._db.collection((log.active) ? 'activeCasts' : 'passiveCasts');

        collection.insertOne(log)
            .then(_ => resolve(true))
            .catch(error => reject(error));
    });
}
