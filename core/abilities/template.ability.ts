import { AbilityType } from '../types'
import { Message } from 'discord.js';

export class Ability {
    public name: string;
    public description: string;
    public args: boolean;
    public min_args: number;
    public usage: string;
    public type: AbilityType;
    public execute: (message: Message, ...args: string[]) => Promise<Message|Message[]>
}

