import { Ability } from './template.ability';
import { active, main, Active, Passive, Main, Fake } from '../types';
import { Message } from 'discord.js';

class Invite implements Ability {
    public name: string = 'invite';
    public description: string = 'Sends an invite link for awesome Luna.';
    public args: boolean = false;
    public min_args: number = 0;
    public usage: string = 'TBD';
    public type: Active|Passive = active;
    public subtype: Main|Fake = main;
    public execute: (message: Message, ...args: string[]) => Promise<Message|Message[]>
    constructor() {
        this.execute = async (message, ...args): Promise<Message|Message[]> => {
            return new Promise((resolve, reject) => {
                if (args.length) message.reply(`What do these even mean? '${args.join(', ')}'`)
                    .catch((err: Error) => console.log(err));
                message.client.generateInvite(67611712).then((response: string) => {
                    message.reply(response)
                        .then((sent: Message) => resolve(sent));
                }).catch((err: Error) => reject(err));
            });
        }
    }
}

export const ability: Ability = new Invite();
