import { Ability } from './template.ability';
import { passive, fake, Active, Passive, Main, Fake } from '../types';
import { Message } from 'discord.js';

class Kys implements Ability {
    public name: string = 'clear';
    public description: string = 'makes Luna kill self';
    public args: boolean = false;
    public min_args: number = 0;
    public usage: string = 'TBD';
    public type: Active|Passive = passive;
    public subtype: Main|Fake = fake;
    public execute: (message: Message, ...args: string[]) => Promise<Message|Message[]>
    constructor() {
        this.execute = async (message, ...args): Promise<Message|Message[]> => {
            return new Promise((_resolve, reject) => {
                if (args.length) message.reply(`What'd you give me those for? '${args.join(', ')}'`)
                    .catch((err: Error) => console.log(err));
                return message.reply('Hold on im gonna go kms.')
                    .then((sent: Message) => {
                        console.log(`Killed myself per ${sent.author.tag}'s instructions.`);
                        process.exit();
                    })
                    .catch((err: Error) => reject(err));
            });
        }
    }
}

export const ability: Ability = new Kys();
