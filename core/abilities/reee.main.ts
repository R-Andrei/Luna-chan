import { Ability } from './template.ability';
import { passive, main, Active, Passive, Main, Fake } from '../types';
import { Message, MessageReaction } from 'discord.js';

class Clear implements Ability {
    public name: string = 'reee';
    public description: string = 'Reeeeeee';
    public args: boolean = false;
    public min_args: number = 0;
    public usage: string = 'uses itself';
    public type: Active|Passive = passive;
    public subtype: Main|Fake = main;
    public execute: (message: Message, ...args: string[]) => Promise<Message|Message[]>
    constructor() {
        this.execute = async (message, ..._args): Promise<Message|Message[]> => {
            return new Promise((resolve, reject) => {
                message.react('\u{1F621}')
                    .then((_result: MessageReaction) => message.channel.send(`Reeeeee!\nWas that necessary? :unamused:`)
                        .then((result: Message) => resolve(result))
                        .catch((err: Error) => reject(err))
                    ).catch((err: Error) => reject(err));   
            });
        }
    }
}

export const ability: Ability = new Clear();
