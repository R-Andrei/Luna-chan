import { get } from 'request-promise';
import { load } from 'cheerio';
import { Ability } from './template.ability';
import { active, main, Active, Passive, Main, Fake } from '../types';
import { Message, Channel } from 'discord.js';

class Hitme implements Ability {
    public name: string = 'hitme';
    public description: string = 'Basically a shitpost in joke format.';
    public args: boolean = false;
    public min_args: number = 0;
    public usage: string = '';
    public type: Active|Passive = active;
    public subtype: Main|Fake = main;
    public execute: (message: Message, ...args: string[]) => Promise<Message|Message[]>
    constructor() {
        this.execute = async (message, ...args): Promise<Message|Message[]> => {
            return new Promise((resolve, reject) => {
                if (args.length) message.reply(`What do these even mean? '${args.join(', ')}'`).catch(err => console.log(err));
                const options = { uri: 'https://www.goodbadjokes.com/', transform: (body: any) => { return load(body); } }
                get(options).then(data => {
                    let jokelist = []
                    const random = Math.floor(Math.random() * 6);
                    data('.post .joke-body-wrap a').each((_index: number, element: any) => {
                        (data(element).find('dt').text().replace(/\s+/g, ' ').length > 1) ? jokelist.push({ setup: data(element).find('dt').text().replace(/\s+/g, ' '), punchline: data(element).find('dd').text().replace(/\s+/g, ' ') }): {};
                    });
                    const target_channel: Channel =  message.client.channels.get(message.channel.id);
                    // @ts-ignore
                    target_channel.send(jokelist[random].setup)
                        // @ts-ignore
                        .then((_sent: Message) => target_channel.send(jokelist[random].punchline)
                            .then((sent: Message) => resolve(sent))
                            .catch((err: Error) => reject(err))
                        );
                }).catch((err: Error) => reject(err));
            });
        }
    }
}

export const ability: Ability = new Hitme();