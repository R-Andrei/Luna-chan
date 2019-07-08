import { Ability } from './template.ability';
import { AbilityType, GuildActive } from '../types';
import { Message } from 'discord.js';

class Clear extends Ability {
    public readonly name: string = 'clear';
    public readonly description: string = 'Clears messages in a channel.';
    public readonly args: boolean = true;
    public readonly min_args: number = 1;
    public readonly usage: string = 'TBD';
    public readonly type: AbilityType = GuildActive;
    public readonly alias: Array<string> = ['clearmessage', 'clearmessages', 'clearchat'];
    public readonly execute = async (message: Message, ...args: string[]): Promise<Message|Message[]> => {
        return new Promise((resolve, reject) => {

        });
    }
}

export const trait: Ability = new Clear();

