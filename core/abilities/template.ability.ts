import { Active, Passive, Main, Fake } from '../types'
import { Message, Snowflake } from 'discord.js';

export class Ability {
    public name: string;
    public description: string;
    public args: boolean;
    public min_args: number;
    public usage: string;
    public type: Active|Passive;
    public subtype: Main|Fake;
    public execute: (message: Message, args: string[]) => Promise<Message|Message[]>
}

