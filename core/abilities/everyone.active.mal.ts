
import { Message, Channel, TextChannel } from 'discord.js';

import { AbilityType, EveryoneActive, AnimeRecord } from '../types';
import { getAnimeList, compareAnimeLists, gradeTranslator } from '../utility/mal.anime.list';
import { random } from '../utility/numbers';
import { Ability } from './template.ability';
import { Luna } from '../luna';
import phrases from '../../phrases';


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

            const { mal } = phrases;

            const starter_pos: number = random(0, mal.starters.length - 1);
            const channel: Channel = message.client.channels.get(message.channel.id);
            (channel as TextChannel).send(mal.starters[starter_pos])
                .catch((error: Error) => reject(error));

            instance.getFakeList()
                .then((fakeList: Array<AnimeRecord>) => {
                    const middler_pos: number = random(0, mal.middlers.length - 1);
                    (channel as TextChannel).send(mal.middlers[middler_pos])
                        .catch((err: Error) => reject(err));
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
                    getAnimeList(args)
                        .then((response: Array<AnimeRecord>) => {

                            const grade: number = compareAnimeLists(fakeList, response);

                            const feeling: string = gradeTranslator(grade);

                            console.log('here', feeling, grade);

                            const finisher_pos: number = random(0, mal.finishers[feeling].length - 1);
                            const channel: Channel = message.client.channels.get(message.channel.id);
                            (channel as TextChannel).send(mal.finishers[feeling][finisher_pos])
                                .catch((error: Error) => reject(error));

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
