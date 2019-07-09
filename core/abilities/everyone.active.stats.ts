import { Ability } from './template.ability';
import { AbilityType, GuildActive } from '../types';
import { Message, RichEmbed, GuildMember } from 'discord.js';
import moment from 'moment';
import { Luna } from '../luna';

class Stats extends Ability {
    public readonly name: string = 'stats';
    public readonly description: string = 'Sends an invite link for awesome Luna.';
    public readonly args: boolean = true;
    public readonly min_args: number = 1;
    public readonly usage: string = '@user_mention, or just !stats';
    public readonly type: AbilityType = GuildActive;
    public readonly alias: Array<string> = ['info', 'me', 'statsme', 'infome', 'profile'];
    public readonly execute = async (message: Message, instance: Luna, ...args: string[]): Promise<Message|Message[]> => {
        return new Promise((resolve, reject) => {
            
            const target: string = (args.length) ? args[0].replace(/[\<\@\!\>]+/g, '') : null;
            const member: GuildMember = (args.length) 
                ? message.guild.members.find((user: GuildMember) => user.id == target) 
                : message.guild.members.find((user: GuildMember) => user.id === message.author.id);
            const embed: RichEmbed = new RichEmbed()
                .setColor(`${member.displayHexColor}`)
                .setTitle(`${member.user.tag}`)
                .setAuthor(`${(member.nickname.length) ? member.nickname : member.user.username}'s stats`, `${member.user.avatarURL}`)
                .setDescription('Looks like this user is a complete degenerate... \\*sigh\\*')
                .setThumbnail(`${member.user.avatarURL}`)
                .addBlankField()
                .addField('Joined this... place :slight_smile::', `${moment(new Date(member.joinedTimestamp)).format('MMM Do YYYY')}`, true)
                .addField('Got this far:', `${(member.highestRole.name == '@everyone') ? 'pretty much nowhere..' : member.highestRole}`, true)
                .addBlankField()
                .addField('Made me do:', `${0} things :unamused:`, true)
                .addField('Mostly wanted:', `${0} :neutral_face:`, true)
                .addBlankField()
                .addField('Experience:', `coming soon`, true)
                .addBlankField()
                .setFooter('put together by awesome me', `${message.client.user.avatarURL}`)
            message.reply(embed)
                .then((sent: Message) => resolve(sent))
                .catch((err: Error) => reject(err));
        });
    }
}

export const trait: Ability = new Stats();
