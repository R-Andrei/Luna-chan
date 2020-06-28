import { Channel, TextChannel } from 'discord.js'


import phrases from '../../phrases';
import { random } from '../utility/numbers';
import { Ability } from './template.ability';
import { AbilityType, EveryoneActive, SimplifiedAbility } from '../types';
import { Message } from 'discord.js';
import { Luna } from '../luna.js';


const { help } = phrases;

class Help extends Ability {
    public readonly name: string = 'help';
    public readonly prefix: string = '!';
    public readonly description: string = 'Standard help command.';
    public readonly args: boolean = false;
    public readonly min_args: number = 0;
    public readonly usage: string = '';
    public readonly type: AbilityType = EveryoneActive;
    public readonly alias: Array<string> = ['helpme', 'halp', 'aaa', 'aaaa', 'needhelp', 'help pls']
    public readonly execute = async (message: Message, instance: Luna, ...args: string[]): Promise<Message | Message[]> => {
        return new Promise((resolve, reject) => {

            const channel: Channel = message.client.channels.get(message.channel.id);
            (channel as TextChannel).send('Ugh what now...')
                .then(_ => {
                    (channel as TextChannel).send(help.middlers[random(0, help.middlers.length - 1)])
                        .then(_ => {
                            const abilities: Array<SimplifiedAbility> = instance.getSimplifiedAbilities();

                            const abilityMessage: string = abilities
                                .filter((ability: Ability) => ability.type?.active && ability.type.everyone)
                                .map((ability: Ability) => `\`\`\`${ability.prefix}${ability.name} ${ability.usage}\`\`\``).join('');

                            (channel as TextChannel).send(abilityMessage)
                                .then(_ => {
                                    (channel as TextChannel).send(help.finishers[random(0, help.finishers.length - 1)])
                                        .then((sent: Message) => resolve(sent))
                                        .catch((err: Error) => reject(err));
                                });
                        });
                })
                .catch((error: Error) => reject(error));

        });
    }
}

export const trait: Ability = new Help();