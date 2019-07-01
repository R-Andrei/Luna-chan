import { Ability } from './template.ability';
import { active, main } from '../types';
import { Message } from 'discord.js';

class Avatar extends Ability {
    constructor() {
        super();
        this.name = 'avatar';
        this.description = 'Posts a link to the avatar of the target. Cuz that\'s polite..'
        this.args = true;
        this.min_args = 1;
        this.usage = '@user_mention, or just !avatar';
        this.type = active;
        this.subtype = main;
        this.execute = async (message: Message, args: string[]): Promise<Message|Message[]> => {
            return new Promise((resolve, reject) => {
                const target: string = (args.length) ? args[0].replace(/[\<\@\!\>]+/g, '') : null;
                const avatar: string = (args.length) ? `${message.client.users.find(user => user.id == target).avatarURL}?size=2048` : `${message.author.avatarURL}?size=2048`;
                message.reply(avatar)
                    .then((sent: Message|Message[]) => resolve(sent))
                    .catch((err: Error) => reject(err));
            });
        }
    }
}

export const ability: Ability = new Avatar();
