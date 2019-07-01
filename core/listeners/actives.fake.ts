import { prefix } from '../prefixes.json'
import { Listener } from './template.listener.js';
import { Luna } from '../luna'
import { fake } from '../types'
import { Message } from 'discord.js';
import { Ability } from '../abilities/template.ability.js';


class ActiveFake implements Listener {
    public name: string = 'actives.fake';
    public description: string = 'Message listener for my messages.';
    public body: (instance: Luna) => () => void;
    constructor() {
        this.body = (instance) => {
            return () => {
                instance.client.on('message', (msg: Message) => {
                    if (msg.content.startsWith(prefix) && !msg.author.bot) {
                        if (msg.author.tag === 'Fake#1000' && msg.channel.id === '588668921075335178') {
                            const args: string[] = msg.content.slice(prefix.length).split(/\s+/);
                            const command: string = args.shift().toLowerCase();
                            if (instance.abilities.find((ability: Ability) => { return ability.name === command && ability.subtype === fake; })) {
                                const ability: Ability = instance.abilities.get(command);
                                ability.execute(msg, ...args)
                                    .then((result: Message) => console.log(result))
                                    .catch((err: Error) => console.log(err));
                            }
                        }
                    }
                    
                });
            }
        }
    }
}

export const listener: Listener = new ActiveFake();

// if (ability.name == 'kys') instance.storage.close_connection()
//                             .then(result => console.log(result))
//                             .catch(err => console.log(err));