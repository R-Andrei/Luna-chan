import { prefix } from '../prefixes.json';
import { Ability } from './template.ability';
import { AbilityType, EveryoneActive } from '../types';
import { Message } from 'discord.js';
import { Luna } from '../luna.js';

class Help extends Ability {
    public readonly name: string = 'help';
    public readonly description: string = 'Standard help command.';
    public readonly args: boolean = true;
    public readonly min_args: number = 1;
    public readonly usage: string = 'TBD';
    public readonly type: AbilityType = EveryoneActive;
    public readonly alias: Array<string> = ['helpme', 'ajutor', 'aaa', 'aaaa', 'needhelp']
    public readonly execute = async (message: Message, _instance: Luna, ...args: string[]): Promise<Message | Message[]> => {
        return new Promise((resolve, reject) => {

        });
    }
}

export const trait: Ability = new Help();