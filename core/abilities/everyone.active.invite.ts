import { Ability } from './template.ability';
import { AbilityType, EveryoneActive } from '../types';
import { Message } from 'discord.js';
import { Luna } from '../luna';

class Invite extends Ability {
    public readonly name: string = 'invite';
    public readonly description: string = 'Sends an invite link for awesome Luna.';
    public readonly args: boolean = false;
    public readonly min_args: number = 0;
    public readonly usage: string = 'TBD';
    public readonly type: AbilityType = EveryoneActive;
    public readonly alias: Array<string> = ['inviteme', 'getinvite', 'sendinvite'];
    public readonly execute = async (message: Message, _instance: Luna, ...args: string[]): Promise<Message | Message[]> => {
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

export const trait: Ability = new Invite();
