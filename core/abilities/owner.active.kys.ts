import { Ability } from './template.ability';
import { AbilityType } from '../types';
import { Message } from 'discord.js';
import { Luna } from '../luna';

class Kys extends Ability {
    public readonly name: string = 'clear';
    public readonly description: string = 'makes Luna kill self';
    public readonly args: boolean = false;
    public readonly min_args: number = 0;
    public readonly usage: string = 'TBD';
    public readonly type: AbilityType = { everyone: false, ownerOnly: true, guildOnly: false, active: true };
    public readonly alias: Array<string> = ['doeet']

    public readonly execute = async (message: Message, _instance: Luna, ...args: string[]): Promise<Message|Message[]> => {
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

export const trait: Ability = new Kys();
