import { Ability } from './template.ability';
import { AbilityType, GuildActive } from '../types';
import { Message, User } from 'discord.js';
import { Luna } from '../luna';

class Avatar extends Ability {
    public readonly name: string = 'avatar';
    public readonly description: string = 'Posts a link to the avatar of the target. Cuz that\'s polite..';
    public readonly args: boolean = true;
    public readonly min_args: number = 1;
    public readonly usage: string = '@user_mention, or just !avatar';
    public readonly type: AbilityType = GuildActive;
    public readonly alias: Array<string> = ['icon', 'profilepic', 'profileimage'];
    public readonly execute = async (message: Message, _instance: Luna, ...args: string[]): Promise<Message | Message[]> => {
        return new Promise((resolve, reject) => {
            const target: string = (args.length) ? args[0].replace(/[\<\@\!\>]+/g, '') : null;
            const avatar: string = (args.length)
                ? `${message.client.users.find((user: User) => user.id == target).avatarURL}?size=2048`
                : `${message.author.avatarURL}?size=2048`;
            message.reply(avatar)
                .then((sent: Message | Message[]) => resolve(sent))
                .catch((err: Error) => reject(err));
        });
    }
}

export const trait: Ability = new Avatar();
