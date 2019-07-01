import { Ability } from './template.ability';
import { active, main, Active, Passive, Main, Fake } from '../types';
import { Message } from 'discord.js';

class Avatar implements Ability {
    public name: string = 'avatar';
    public description: string = 'Posts a link to the avatar of the target. Cuz that\'s polite..';
    public args: boolean = true;
    public min_args: number = 1;
    public usage: string = '@user_mention, or just !avatar';
    public type: Active|Passive = active;
    public subtype: Main|Fake = main;
    public execute: (message: Message, ...args: string[]) => Promise<Message|Message[]>
    constructor() {
        this.type = active;
        this.subtype = main;
        this.execute = async (message, ...args): Promise<Message|Message[]> => {
            console.log(args);
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
