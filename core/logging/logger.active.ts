import { Message, TextChannel, GroupDMChannel, DMChannel } from 'discord.js';
import { prefix } from '../prefixes.json';
import moment from 'moment';
import { Actions } from '../types'

export class Logger {
    private actions: Actions;
    constructor () {
        this.actions = {
            ability: {
                activity: "casting",
                subject: "ability"
            },
            transaction: {
                activity: "storing",
                subject: "cast"
            }
        }
    }

    log_ability_error (message: Message, ability: any, action: string, error: string) {
        const text_channel: TextChannel | DMChannel| GroupDMChannel = message.channel
        if (text_channel instanceof DMChannel || text_channel instanceof GroupDMChannel) return
        console.log([
            `\n${moment(new Date(message.createdTimestamp)).format('YYYY-MM-DD, h:mm:ss a')}:`,
            `Error ${this.actions[action].activity} ${this.actions[action].subject}`,
            `${prefix}${ability.name} for user: ${message.author.tag} on channel '${text_channel.name}'`,
            `${(message.guild) ? 'of guild ' + "'" + message.guild.name + "'\n" : '\n' }`,
            `Error info: ${error}`
        ].join(' '));
    }

    log_ability_success (result: Message|Array<Message>, message: Message, ability: any) {
        if (result instanceof Array) return
        const text_channel: TextChannel | DMChannel| GroupDMChannel = result.channel
        if (text_channel instanceof DMChannel || text_channel instanceof GroupDMChannel) return
        console.log([
            `\n${moment(new Date(message.createdTimestamp)).format('YYYY-MM-DD, h:mm:ss a')}:`,
            `Succesfully casted ability ${prefix}${ability.name} for user ${message.author.tag}.`,
            `Result on channel '${text_channel.name}' ${(message.guild) ? 'of guild ' + "'" + message.guild.name + "'" : '\n' }`
        ].join(' '));
    }
}
