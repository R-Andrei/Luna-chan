import { get } from 'request-promise';
import { load } from 'cheerio';
import { Ability } from './template.ability';
import { AbilityType, EveryoneActive } from '../types';
import { Message } from 'discord.js';

class Gif implements Ability {
    public name: string = 'gif';
    public description: string = 'Sends poor quality jifs.';
    public args: boolean = true;
    public min_args: number = 1;
    public usage: string = '<tags> <*separated by spaces>';
    public type: AbilityType = EveryoneActive;
    public execute: (message: Message, ...args: string[]) => Promise<Message|Message[]>
    constructor() {
        this.execute = async (message, ...args): Promise<Message|Message[]> => {
            return new Promise((resolve, reject) => {
                const base_url = 'https://tenor.com';
                const options = { 
                    uri: `https://tenor.com/search/${args.join('-')}-gifs`, 
                    transform: (body: any) => { return load(body); } 
                };
                get(options).then((response: any) => {
                    const random: number = Math.floor(Math.random() * Math.floor(response('.GifListItem').length - 1));
                    let giflist: string[] = [];
                    response('.GifList div .GifListItem').each((_index: number, element: any) => {
                        const url: string = response(element).find('a').attr('href');
                        if (url.startsWith('/view')) giflist.push(url);
                    });
                    // @ts-ignore
                    message.client.channels.get(message.channel.id).send(`${base_url}${giflist[random]}`)
                        .then((sent: Message) => resolve(sent))
                        .catch((err: Error) => reject(err));
                }).catch((err: Error) => reject(err));
            });
        }
    }
}

export const ability: Ability = new Gif();
