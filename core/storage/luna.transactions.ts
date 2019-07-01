import { Generic, SetServerRecord, AbilityRecord } from '../types'
import { Message, TextChannel, DMChannel, GroupDMChannel } from 'discord.js';
import Mongo from 'mongodb';


export class StorageWorker {
    public database_name: string;
    public collections: Generic;
    private address: string;
    private client: Mongo.MongoClient;
    private database: Mongo.Db;
    constructor (user: string, token: string, address: string, database: string, collections: Generic) {
        this.address = address;
        this.database_name = database;
        this.collections = collections;
        this.client = new Mongo.MongoClient(`mongodb+srv://${user}:${token}@${address}/${database}/?retryWrites=true&w=majority`, { useNewUrlParser: true });
    }

    async open_connection (): Promise<string> {
        return new Promise((resolve, reject) => {
            this.client.connect()
                .then((_result: any) => {
                    this.database = this.client.db(this.database_name);
                    resolve(`Connected to '${this.database_name}' at '${this.address}'`);
                })
                .catch((err: any) => reject(err));
        });
    }

    async record_cast (message: Message, ability: any): Promise<string> {
        const text_channel: TextChannel | DMChannel| GroupDMChannel = message.channel
        if (text_channel instanceof DMChannel || text_channel instanceof GroupDMChannel) return
        return new Promise((resolve, reject) => {
            const collection = this.database.collection(this.collections.abilities);
            collection.countDocuments({ "_id": { $ne: null } })
                .then((result: number) => {
                    const data_set: AbilityRecord = {
                        _id: ++result,
                        user: message.author.tag,
                        user_id: Number(message.author.id),
                        channel: text_channel.name,
                        server: message.guild.name,
                        server_id: Number(message.guild.id),
                        ability: ability.name,
                        timestamp: message.createdTimestamp
                    };
                    collection.insertOne(data_set)
                        .then((_result: Mongo.InsertOneWriteOpResult) => resolve(`Transaction finished. Inserted data set (${Object.values(data_set).join(', ')}) into collection ${this.collections.abilities}'.`))
                        .catch((err: Error) => reject(err));
                })
                .catch((err: Error) => reject(err));
        });
    }

    async update_server (server: any, record_type: any): Promise<string> {
        const collection = this.database.collection(this.collections.servers);
        return new Promise((resolve, reject) => {
            const data_set: SetServerRecord = { $set :{
                _id: Number(server.id),
                type: record_type,
                name: server.name,
                members: Number(server.memberCount),
                owner_name: server.owner.displayName,
                owner_tag: server.owner.user.tag,
                created: server.createdTimestamp,
                joined: server.joinedTimestamp
            }};
            collection.findOneAndUpdate(
                {"server_id": server.id, "type": record_type},
                data_set,
                { upsert: true }
            )
            .then((_result: Mongo.FindAndModifyWriteOpResultObject ) => 
                resolve(`Transaction finished. Inserted data set (${Object.values(data_set['$set']).join(', ')}) into collection ${this.collections.servers}'.`)
            )
            .catch((err: Error) => reject(err));

        });
    }

    async close_connection (): Promise<string> {
        return new Promise((resolve, reject) => {
            this.client.close()
                .then((_result: void) => resolve(`\nKilled connection to database '${this.database_name}' of '${this.address}'`))
                .catch((err: Error) => reject(err));
        });
    }
}
