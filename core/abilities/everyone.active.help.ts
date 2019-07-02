import { prefix } from '../prefixes.json';
import { Ability } from './template.ability';
import { AbilityType, EveryoneActive } from '../types';
import { Message } from 'discord.js';

class Help implements Ability {
    public name: string = 'help';
    public description: string = 'Standard help command.';
    public args: boolean = true;
    public min_args: number = 1;
    public usage: string = 'TBD';
    public type: AbilityType = EveryoneActive;
    public execute: (message: Message, ...args: string[]) => Promise<Message|Message[]>
    constructor() {
        this.execute = async (message, ...args): Promise<Message|Message[]> => {
            return new Promise((resolve, reject) => {

            });
        }
    }
}

export const ability: Ability = new Help();