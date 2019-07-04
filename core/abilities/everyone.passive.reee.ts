import { Ability } from './template.ability';
import { AbilityType, GuildPassive } from '../types';
import { Message, MessageReaction } from 'discord.js';

class Clear extends Ability {
    public readonly name: string = 'reee';
    public readonly description: string = 'Reeeeeee';
    public readonly args: boolean = false;
    public readonly min_args: number = 0;
    public readonly usage: string = 'uses itself';
    public readonly type: AbilityType = GuildPassive;

    public readonly execute = async (message: Message, ..._args: string[]): Promise<Message|Message[]> => {
        return new Promise((resolve, reject) => {
            message.react('\u{1F621}')
                .then((_result: MessageReaction) => message.channel.send(`Reeeeee!\nWas that necessary? :unamused:`)
                    .then((result: Message) => resolve(result))
                    .catch((err: Error) => reject(err))
                ).catch((err: Error) => reject(err));   
        });
    }
}

export const trait: Ability = new Clear();
