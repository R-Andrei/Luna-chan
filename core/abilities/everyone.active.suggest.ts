
import { Message, Channel, TextChannel } from 'discord.js';

import { AbilityType, EveryoneActive, AnimeRecord } from '../types';
import { getAnimeList, compareAnimeLists, gradeTranslator } from '../utility/mal.anime.list';
import { random } from '../utility/numbers';
import { Ability } from './template.ability';
import { Luna } from '../luna';
import phrases from '../../phrases';


class Tastecheck extends Ability {
    public readonly name: string = 'suggest';
    public readonly prefix: string = '!';
    public readonly description: string = 'Recommends anime based on given genre.';
    public readonly args: boolean = true;
    public readonly min_args: number = 1;
    public readonly usage: string = '(optional) <genre(s)>';
    public readonly type: AbilityType = EveryoneActive;
    public readonly alias: Array<string> = ['recommend', 'propose'];
    public readonly execute = async (message: Message, instance: Luna, ...args: string[]): Promise<Message | Message[]> => {
        return new Promise((resolve, reject) => {


            // recommend new anime

            const channel: Channel = message.client.channels.get(message.channel.id);

            (channel as TextChannel).send('test')
                .then((sent: Message) => resolve(sent))
                .catch((err: Error) => reject(err));
        });
    }
}

export const trait: Ability = new Tastecheck();
