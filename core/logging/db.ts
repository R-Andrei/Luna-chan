import { MongoClient, Collection, Db } from 'mongodb';

import { DB_NAME, DB_ADDRESS, DB_PORT } from '../../config';
import { LogRecord, AnimeRecord } from '../types';


export class Database {

    private readonly uri: string = `mongodb://${DB_ADDRESS}:${DB_PORT}/${DB_NAME}`;

    private _client: MongoClient = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    private _logs: Db | null = null;
    private _data: Db | null = null;
    private _fake: Date = new Date();

    public readonly getFakeDate = (): Date => this._fake;
    public readonly setFakeDate = (): void => { this._fake = new Date() };

    public readonly connect = async (): Promise<boolean> => {
        return new Promise((resolve, reject) => {

            this._client.connect()
                .then(client => {
                    this._client = client;
                    this._logs = this._client.db('logs');
                    this._data = this._client.db('data');
                    resolve(true);
                })
                .catch(error => reject(error));
        });
    }

    public readonly logAbility = async (log: LogRecord): Promise<boolean> => new Promise((resolve, reject) => {
        const collection: Collection = this._logs.collection((log.active) ? 'activeCasts' : 'passiveCasts');

        collection.insertOne(log)
            .then(_ => resolve(true))
            .catch((error: Error) => reject(error));
    });

    public readonly updateFakeList = async (animeList: Array<AnimeRecord>): Promise<boolean> => new Promise((resolve, reject) => {
        const collection: Collection = this._data.collection('fakeList');

        collection.insertMany(animeList)
            .then(_ => resolve(true))
            .catch((error: Error) => reject(error));
    });
    public readonly getFakeList = async (): Promise<Array<AnimeRecord>> => new Promise((resolve, reject) => {
        const collection: Collection = this._data.collection('fakeList');

        collection.find().toArray()
            .then((fakeList: Array<AnimeRecord>) => (fakeList.length > 0)
                ? resolve(fakeList)
                : reject(new Error('Did not find any fake anime records.'))
            )
            .catch((error: Error) => reject(error));
    });

}
