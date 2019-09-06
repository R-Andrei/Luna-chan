import { MongoClient, Db, InsertOneWriteOpResult, FindAndModifyWriteOpResultObject } from 'mongodb';
import { Message, TextChannel, DMChannel, GroupDMChannel, Guild, User } from 'discord.js';
import { Generic, SetServerRecord, AbilityRecord } from '../types'
import { Ability } from '../abilities/template.ability';


export class StorageWorker {
    private client: MongoClient;
    private database: Db;
    constructor(
        private readonly user: string, private readonly token: string, private readonly address: string,
        public readonly databaseName: string, public readonly collections: Generic
    ) {
        this.client = new MongoClient(`mongodb+srv://${this.user}:${this.token}@${this.address}/${this.databaseName}/?retryWrites=true&w=majority`, { useNewUrlParser: true });
    }

    public readonly open = async (): Promise<string> => {
        return new Promise((resolve, reject) => {
            this.client.connect()
                .then((_result: any) => {
                    this.database = this.client.db(this.databaseName);
                    resolve(`Connected to '${this.databaseName}' at '${this.address}'`);
                })
                .catch((err: Error) => reject(err));
        });
    }

    public readonly updateAbility = async (message: Message, ability: Ability): Promise<string> => {
        return new Promise((resolve, reject) => {
            const text_channel: TextChannel | DMChannel | GroupDMChannel = message.channel
            if (text_channel instanceof TextChannel) {
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
                        }
                        collection.insertOne(data_set)
                            .then((_result: InsertOneWriteOpResult) => resolve(`Transaction finished. Inserted data set (${Object.values(data_set).join(', ')}) into collection ${this.collections.abilities}'.`))
                            .catch((error: Error) => reject(error));
                    })
                    .catch((error: Error) => reject(error));
            }
            else reject(new Error(`Command ${ability.name} originated on DM channel.`));
        });
    }

    public readonly updateServer = async (server: Guild, record_type: string): Promise<string> => {
        const collection = this.database.collection(this.collections.servers);
        return new Promise((resolve, reject) => {
            const data_set: SetServerRecord = {
                $set: {
                    _id: Number(server.id),
                    type: record_type,
                    name: server.name,
                    members: Number(server.memberCount),
                    owner_name: server.owner.displayName,
                    owner_tag: server.owner.user.tag,
                    created: server.createdTimestamp,
                    joined: server.joinedTimestamp
                }
            };
            collection.findOneAndUpdate(
                { "server_id": server.id, "type": record_type },
                data_set,
                { upsert: true }
            )
                .then((_result: FindAndModifyWriteOpResultObject) =>
                    resolve(`Transaction finished. Inserted data set (${Object.values(data_set['$set']).join(', ')}) into collection ${this.collections.servers}'.`)
                )
                .catch((err: Error) => reject(err));

        });
    }

    public readonly getMessages = async (user: User): Promise<number> => {
        const collection = this.database.collection(this.collections.abilities);
        return new Promise((resolve, reject) => {
            collection.countDocuments({ "user": user.tag })
                .then((result: number) => resolve(result))
                .catch((error: Error) => reject(error));
        });
    }

    public readonly getUsed = async (user: User): Promise<string> => {
        const collection = this.database.collection(this.collections.abilities);
        return new Promise((resolve, reject) => {
            collection.aggregate([
                { $match: { "user": `${user}` } },
                { $group: { _id: "$ability", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 1 }
            ]).toArray()
                .then((result: Array<any>) => (result.length) ? resolve(result[0]) : reject(new Error('No abilities found for user.')))
                .catch((error: Error) => reject(error));
        });
    }

    public readonly close_connection = async (): Promise<string> => {
        return new Promise((resolve, reject) => {
            this.client.close()
                .then((_result: void) => resolve(`\nKilled connection to database '${this.databaseName}' of '${this.address}'`))
                .catch((err: Error) => reject(err));
        });
    }
}
