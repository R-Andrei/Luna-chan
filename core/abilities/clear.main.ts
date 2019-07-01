import { Ability } from './template.ability';
import { active, main, Active, Passive, Main, Fake } from '../types';
import { Message } from 'discord.js';

class Clear implements Ability {
    public name: string = 'clear';
    public description: string = 'Clears messages in a channel.';
    public args: boolean = true;
    public min_args: number = 1;
    public usage: string = 'TBD';
    public type: Active|Passive = active;
    public subtype: Main|Fake = main;
    public execute: (message: Message, ...args: string[]) => Promise<Message|Message[]>
    constructor() {
        this.execute = async (message, ...args): Promise<Message|Message[]> => {
            return new Promise((resolve, reject) => {

            });
        }
    }
}

export const ability: Ability = new Clear();

