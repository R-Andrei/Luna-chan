import { MongoClient, Collection } from 'mongodb';
import moment from 'moment';

import { DB_NAME, DB_ADDRESS, DB_PORT } from '../../config';
import { LogRecord } from '../types';
import { Message, TextChannel, DMChannel, GroupDMChannel } from 'discord.js';
import { Ability } from '../abilities/template.ability';

export class Logger {

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

    public log = (message: Message, ability: Ability, error: Error = null, _result: null | Message | Array<Message> = null): void => {
        const collection: Collection = this._db.collection((ability.type.active) ? 'activeCasts' : 'passiveCasts');
        const text_channel: TextChannel | DMChannel | GroupDMChannel = message.channel;
        const groupText = text_channel instanceof TextChannel || text_channel instanceof GroupDMChannel;
        const log: LogRecord = {
            active: ability.type.active,
            timestamp: new Date(message.createdTimestamp),
            ability: ability.name,
            error: !!error,
            user: message?.author?.tag,
            userid: message.author.id,
            guild: (message.guild) ? message.guild.name : '!DirectMessage',
            guildid: (message.guild) ? message.guild.id : null,
            // @ts-ignore
            channel: (groupText) ? text_channel.name : 'message.author.tag',
            channelid: (groupText) ? text_channel.id : null,
            info: ''
        }
        collection.insertOne(log)
            .then(_ => console.log(`${moment(new Date(message.createdTimestamp)).format('YYYY-MM-DD, h:mm:ss a')}: successfully logged action.`))
            .catch(error => console.log(error));
    }
}
