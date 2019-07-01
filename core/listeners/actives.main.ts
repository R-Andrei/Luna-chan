import { prefix } from '../prefixes.json'
import { Listener } from './template.listener.js';
import { Luna } from '../luna'
import { Ability } from '../abilities/template.ability.js';
import { main } from '../types.js';
import { Message } from 'discord.js';


class ActiveMain implements Listener {
    public name: string = 'actives.main';
    public description: string = 'Main message listener. Used by all users for commands.';
    public body: (instance: Luna) => () => void;
    constructor() {
        this.body = (instance) => {
            return () => {
                instance.client.on('message', msg => {
                    if (msg.content.startsWith(prefix) && !msg.author.bot) {
                        const args: string[] = msg.content.slice(prefix.length).split(/\s+/);
                        const command: string = args.shift().toLowerCase();
                        if (instance.abilities.find(ability => { return ability.name === command && ability.subtype === main; })) {
                            const ability: Ability = instance.abilities.get(command);

                            ability.execute(msg, args)
                                .then((result: Message|Message[]) => {
                                    instance.logger.log_ability_success(result, msg, ability);
                                    instance.storage.update_ability(msg, ability)
                                        .then((result: string) => console.log(result))
                                        .catch((err: Error) => instance.logger.log_ability_error(msg, ability, 'transaction', err));
                                })
                                .catch((err: Error) => {
                                    instance.logger.log_ability_error(msg, ability, 'ability', err);
                                    msg.reply(`Woah that spectacularly didn\'t work out! Sure u were using it like this? ${prefix}${ability.name} ${ability.usage}`)
                                        .catch((err: Error) => console.log(err));
                                });
                        }
                    }
                });
            }
        }
    }
}

export const listener: Listener = new ActiveMain();