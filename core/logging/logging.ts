import moment from 'moment';

import { LogRecord } from '../types';
import { Message, TextChannel, DMChannel, GroupDMChannel } from 'discord.js';
import { Ability } from '../abilities/template.ability';
import { Luna } from '../luna';
import { Db } from './db';


export class Logger {

    private readonly _luna: Luna;
    private readonly _database: Db;

    constructor(instance: Luna, db: Db) {
        this._luna = instance;
        this._database = db;
    }

    public logAbility = (message: Message, ability: Ability, error: Error = null, _result: null | Message | Array<Message> = null): void => {
        const text_channel: TextChannel | DMChannel | GroupDMChannel = message.channel;
        const groupText = text_channel instanceof TextChannel || text_channel instanceof GroupDMChannel;
        const abilityLog: LogRecord = {
            active: ability.type.active,
            timestamp: new Date(message.createdTimestamp),
            ability: ability.name,
            error: !!error,
            user: message.author.tag,
            userid: message.author.id,
            guild: (message.guild) ? message.guild.name : '!DirectMessage',
            guildid: (message.guild) ? message.guild.id : null,
            // @ts-ignore
            channel: (groupText) ? text_channel.name : 'message.author.tag',
            channelid: (groupText) ? text_channel.id : null,
            info: ''
        }
        this._database.logAbility(abilityLog)
            .then(_ => console.log(`${moment(abilityLog.timestamp).format('YYYY-MM-DD, h:mm:ss a')}: successfully logged action.`))
            .catch(error => console.error(error));
    }

}