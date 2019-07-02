import { Ability } from './template.ability';
import { AbilityType, GuildActive } from '../types';
import { Message } from 'discord.js';

class Clear implements Ability {
    public name: string = 'clear';
    public description: string = 'Clears messages in a channel.';
    public args: boolean = true;
    public min_args: number = 1;
    public usage: string = 'TBD';
    public type: AbilityType = GuildActive;
    public execute: (message: Message, ...args: string[]) => Promise<Message|Message[]>
    constructor() {
        this.execute = async (message, ...args): Promise<Message|Message[]> => {
            return new Promise((resolve, reject) => {

            });
        }
    }
}

export const ability: Ability = new Clear();

