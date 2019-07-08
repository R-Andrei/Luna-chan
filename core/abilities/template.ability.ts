import { AbilityType } from '../types'
import { Message } from 'discord.js';

export class Ability {
    public readonly name: string;
    public readonly description: string;
    public readonly args: boolean;
    public readonly min_args: number;
    public readonly usage: string;
    public readonly type: AbilityType;
    public readonly alias?: Array<string>
    public execute: (message: Message, ...args: string[]) => Promise<Message|Message[]>
}

