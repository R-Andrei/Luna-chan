import { Active, Passive, Main, Fake } from '../types';
import { Message } from 'discord.js';
export declare class Ability {
    name: string;
    description: string;
    args: boolean;
    min_args: number;
    usage: string;
    type: Active | Passive;
    subtype: Main | Fake;
    execute: (message: Message, args: string[]) => Promise<Message | Message[]>;
}
