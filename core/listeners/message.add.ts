import { Ability } from '../abilities/template.ability.js';
import { Listener } from './template.listener.js';
import { prefix } from '../prefixes.json'
import { Luna } from '../luna'
import { Message } from 'discord.js';


class MessageAdd extends Listener {
    public name: string = 'message.add';
    public description: string = 'Main message listener. Used by all users for commands.';
    public body: (instance: Luna) => () => void;
    constructor() {
        super();
        this.body = (instance) => {
            return () => {
                console.log('here');
                instance.client.on('message', (message: Message) => {
                    const listener: Listener = instance.listeners.get('message.add');

                    if (message.content.startsWith(prefix) && !message.author.bot) {
                        const args: string[] = message.content.slice(prefix.length).split(/\s+/);
                        const command: string = args.shift().toLowerCase();

                        if (message.author.tag === 'Fake#1000' && message.channel.id === '588668921075335178' && listener instanceof MessageAdd) {
                            listener.fake_execute(instance, command, args, message);
                        } 
                        
                        else listener.execute(instance, command, args, message)
                            .then((result: string) => console.log(result))
                            .catch((err: Error) => console.log(err));
                    } 
                    
                    else if (!message.content.startsWith(prefix) && !message.author.bot && listener instanceof MessageAdd) 
                        listener.passive_execute(instance, message);
                });
            }
        }
    }

    public execute = async (instance: Luna, command: string, args: string[], message: Message): Promise<string> => {
        if (instance.abilities.get(command)) {
            return new Promise((resolve, reject) => {
                const ability: Ability = instance.abilities.get(command);
                ability.execute(message, ...args)
                    .then((result: Message|Message[]) => {
                        instance.logger.log_ability_success(result, message, ability);
                        instance.storage.update_ability(message, ability)
                            .then((result: string) => resolve(result))
                            .catch((err: Error) => {
                                instance.logger.log_ability_error(message, ability, 'transaction', err);
                                reject(err);
                            });
                    })
                    .catch((err: Error) => {
                        instance.logger.log_ability_error(message, ability, 'ability', err);
                        message.reply(`Woah that spectacularly didn\'t work out! Sure u were using it like this? ${prefix}${ability.name} ${ability.usage}`)
                            .catch((err: Error) => console.log(err));
                        reject(err);
                    });
            })
        }
    }

    public fake_execute = (instance: Luna, command: string, args: string[], message: Message): void => {
        if (instance.abilities.get(command)) {
            const ability: Ability = instance.abilities.get(command);

            if (ability.name == 'kys') instance.storage.close_connection()
               .then(result => console.log(result))
               .catch(err => console.log(err));
        }
    }

    public passive_execute = (instance: Luna, message: Message): void => {
        let ability: Ability;
        if (message.mentions.everyone) ability = instance.abilities.get('reee');
        if (typeof ability === undefined) return;
        ability.execute(message)
            .then((_result: Message|Message[]) => {})
            .catch((err: Error) => instance.logger.log_ability_error(message, ability, 'transaction', err));
        
    }
}

export const listener: Listener = new MessageAdd();