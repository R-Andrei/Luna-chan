
import { Message, Channel, TextChannel } from 'discord.js';

import { starters, judging } from '../utility/everyone.active.mal.phrases';
import { AbilityType, EveryoneActive, AnimeRecord } from '../types';
import { getAnimeList, compareAnimeLists } from '../utility/mal.anime.list';
import { random } from '../utility/numbers';
import { Ability } from './template.ability';
import { Luna } from '../luna';


class Tastecheck extends Ability {
    public readonly name: string = 'tastecheck';
    public readonly description: string = 'Checks the taste in anime of the given poor victim.';
    public readonly args: boolean = true;
    public readonly min_args: number = 1;
    public readonly usage: string = '<MAL username> or <link to MAL profile>';
    public readonly type: AbilityType = EveryoneActive;
    public readonly alias: Array<string> = ['malcheck', 'myanimelist', 'rateme'];
    public readonly execute = async (message: Message, instance: Luna, ...args: string[]): Promise<Message | Message[]> => {
        return new Promise((resolve, reject) => {

            const s_pos: number = random(0, starters.length - 1);
            const channel: Channel = message.client.channels.get(message.channel.id);
            (channel as TextChannel).send(starters[s_pos])
                .catch((error: Error) => reject(error));

            instance.getFakeList()
                .then((fakeList: Array<AnimeRecord>) => {
                    const now: Date = new Date();
                    if (Math.abs(now.getTime() - instance.getFakeDate().getTime()) * 1000.0 * 60.0 * 60.0 * 24.0 >= 1.0) {
                        getAnimeList(['Fake-'])
                            .then((response: Array<AnimeRecord>) => {
                                const fakeList: Array<AnimeRecord> = response;
                                instance.updateFakeList(fakeList)
                                    .then(_ => {
                                        console.log('Updated fake list at timestamp.');
                                        instance.setFakeDate();
                                    });
                            })
                            .catch((error: Error) => reject(error));
                    }
                    else
                        getAnimeList(args)
                            .then((response: Array<AnimeRecord>) => {

                                const j_pos: number = random(0, judging.length - 1);
                                (channel as TextChannel).send(judging[j_pos])
                                    .catch((err: Error) => reject(err));

                                const grade: number = compareAnimeLists(fakeList, response);

                                (channel as TextChannel).send(`mmm. it's a ${grade.toFixed(1)}`)
                                    .then((sent: Message) => resolve(sent))
                                    .catch((err: Error) => reject(err));
                            })
                            .catch((error: Error) => reject(error));
                })
        });
    }
}

export const trait: Ability = new Tastecheck();
