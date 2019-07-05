import { Ability } from '../abilities/template.ability.js';
import { Listener } from './template.listener.js';
import { prefix } from '../prefixes.json'
import { Luna } from '../luna'
import { Message } from 'discord.js';


class MessageAdd extends Listener {
    public readonly name: string = 'message';
    public readonly description: string = 'Main message listener. Used by all users for commands.';

    public readonly body = (instance: Luna): () => void => {
        return () => {
            instance.Client(this).on('this.name', (message: Message) => {
                const listener: Listener = instance.getListener(this.name);
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

    public readonly execute = (instance: Luna, command: string, args: string[], message: Message): void => {
        if (instance.getAbility(command)) {
            const ability: Ability = instance.getAbility(command);
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
        if (instance.getAbility(command)) {
            const ability: Ability = instance.getAbility(command);
            ability.execute(message);
        }
    }

    public readonly passive_execute = (instance: Luna, message: Message): void => {
        let ability: Ability;
        if (message.mentions.everyone) ability = instance.getAbility('reee');
        if (ability === undefined) return;
        ability.execute(message)
            .then((_result: Message|Message[]) => {})
            .catch((err: Error) => instance.logger.log_ability_error(message, ability, 'transaction', err));
    }
}

export const trait: Listener = new MessageAdd();