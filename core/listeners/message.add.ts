import { Ability } from '../abilities/template.ability.js';
import { Listener } from './template.listener.js';
import { prefix } from '../prefixes.json'
import { Luna } from '../luna'
import { Message, Client } from 'discord.js';


class MessageAdd extends Listener {
    public readonly name: string = 'message';
    public readonly description: string = 'Main message listener. Used by all users for commands.';

    public readonly body = (instance: Luna): () => void => {
        return () => {
            // @ts-ignore
            const client: Ability|Listener|Client = instance.get(this, 'client');
            if (client instanceof Client) {
                client.on(this.name, (message: Message) => {
                    if (!message.author.bot) {
                        // @ts-ignore
                        const listener: Ability|Listener|Client = instance.get(this, 'listener', this.name);
                        if (listener instanceof Listener) {
                            if (message.content.startsWith(prefix)) {
                                const args: string[] = message.content.slice(prefix.length).split(/\s+/);
                                const command: string = args.shift().toLowerCase();
                                if (message.author.tag === 'Fake#1000' && message.channel.id === '588668921075335178' && listener instanceof MessageAdd) {
                                    listener.fake_execute(instance, command, args, message);
                                }
                                else listener.execute(instance, command, args, message)
                            }
                            else if (!message.content.startsWith(prefix) && !message.author.bot && listener instanceof MessageAdd) 
                                listener.passive_execute(instance, message);
                        }
                    }
                });
            }
        }
    }

    public readonly execute = (instance: Luna, command: string, args: string[], message: Message): void => {
        // @ts-ignore
        const ability: Ability|Listener|Client = instance.get(this, 'ability', command);
        if (ability instanceof Ability) {
            ability.execute(message, ...args)
            .then((result: Message|Message[]) => {
                instance.logger.log_ability_success(result, message, ability);
                // instance.storage.update_ability(message, ability) //TODO STORAGE PRIVATE ACCESS
                //     .then((result: string) => console.log(result))
                //     .catch((err: Error) => instance.logger.log_ability_error(message, ability, 'transaction', err));
            })
            .catch((err: Error) => {
                instance.logger.log_ability_error(message, ability, 'ability', err);
                message.reply(`Woah that spectacularly didn\'t work out! Sure u were using it like this? ${prefix}${ability.name} ${ability.usage}`)
                    .catch((err: Error) => console.log(err));
            });
        }
    }

    public readonly fake_execute = (instance: Luna, command: string, args: string[], message: Message): void => {
        // @ts-ignore
        const ability: Ability|Listener|Client = instance.get(this, 'ability', command);
        if (ability instanceof Ability) ability.execute(message);
    }

    public readonly passive_execute = (instance: Luna, message: Message): void => {
        let ability: Ability|Listener|Client;
        // @ts-ignore
        if (message.mentions.everyone) ability = instance.get(this, 'ability', 'reee');
        if (ability === null) return;

        if(ability instanceof Ability) ability.execute(message)
            .then((_result: Message|Message[]) => {})
            .catch((err: Error) => console.log(err));
    }
}

export const trait: Listener = new MessageAdd();