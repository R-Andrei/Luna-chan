import { Ability } from './template.ability';
import { active, main, Active, Passive, Main, Fake } from '../types';
import { Message, RichEmbed, GuildMember } from 'discord.js';
import moment from 'moment';

class Stats implements Ability {
    public name: string = 'stats';
    public description: string = 'Sends an invite link for awesome Luna.';
    public args: boolean = true;
    public min_args: number = 1;
    public usage: string = '@user_mention, or just !stats';
    public type: Active|Passive = active;
    public subtype: Main|Fake = main;
    public execute: (message: Message, ...args: string[]) => Promise<Message|Message[]>
    constructor() {
        this.execute = async (message, ...args): Promise<Message|Message[]> => {
            return new Promise((resolve, reject) => {
                const target: string = (args.length) ? args[0].replace(/[\<\@\!\>]+/g, '') : null;
                const member: GuildMember = (args.length) 
                    ? message.guild.members.find((user: GuildMember) => user.id == target) 
                    : message.guild.members.find((user: GuildMember) => user.id === message.author.id);
                const embed: RichEmbed = new RichEmbed()
                    .setColor(`${member.displayHexColor}`)
                    .setTitle(`${member.user.tag}`)
                    .setAuthor(`${(member.nickname) ? member.nickname.length : member.user.username}'s stats`, `${member.user.avatarURL}`)
                    .setDescription('Looks like this user is a complete degenerate... \\*sigh\\*')
                    .setThumbnail(`${member.user.avatarURL}`)
                    .addBlankField()
                    .addField('Joined this junkyard at:', `${moment(new Date(member.joinedTimestamp)).format('MMM Do YYYY')}`, true)
                    .addField('Managed to get this far:', `${(member.highestRole.name == '@everyone') ? 'pretty much nowhere..' : member.highestRole}`, true)
                    .addBlankField()
                    .addField('Crappy messages sent:', `coming soon`, true)
                    .addField('Experience gained:', `coming soon`, true)
                    .addBlankField()
                    .setFooter('put together by awesome me', `${message.client.user.avatarURL}`)
                message.reply(embed)
                    .then((sent: Message) => resolve(sent))
                    .catch((err: Error) => reject(err));
            });
        }
    }
}

export const ability: Ability = new Stats();
