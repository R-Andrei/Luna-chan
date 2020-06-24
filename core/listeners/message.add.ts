import { Ability } from '../abilities/template.ability.js';
import { Listener } from './template.listener.js';
import { prefix, settings } from '../prefixes.json'
import { Luna } from '../luna'
import { Message, Client, Collection } from 'discord.js';


class MessageAdd extends Listener {

    public readonly name: string = 'message';
    public readonly description: string = 'Main message listener. Used by all users for commands.';

    public readonly body = (instance: Luna): () => void => {
        return () => {
            // @ts-ignore
            const client: Client = instance.get(this, 'client');

            client.on(this.name, (message: Message) => {
                if (!message.author.bot) {
                    const messagePrefix: string = message.content.slice(0, 1);
                    // @ts-ignore
                    const listener: Listener = instance.get(this, 'listener', this.name);
                    if (listener instanceof MessageAdd && (messagePrefix === prefix || messagePrefix === settings)) {
                        const args: string[] = message.content.slice(prefix.length).split(/\s+/);
                        const command: string = args.shift().toLowerCase();
                        if (message.author.id === '165907010267774976' && message.channel.id === '588668921075335178')
                            listener.fake_execute(instance, command, args, message);
                        else if (messagePrefix === '!')
                            listener.execute(instance, command, args, message)
                        else
                            listener.setting(instance, command, args, message);
                    }
                    else if (!message.content.startsWith(prefix) && listener instanceof MessageAdd)
                        listener.passive_execute(instance, message);
                }
            });
        }
    }

    public readonly execute = (instance: Luna, command: string, args: string[], message: Message): void => {
        // @ts-ignore
        const abilities: Collection<Ability> = instance.get(this, 'ability');
        const ability: Ability | null = abilities.get(command) || abilities.find((item: Ability) => item.alias && item.alias.includes(command));
        if (ability instanceof Ability) {
            ability.execute(message, instance, ...args)
                .then((result: Message | Message[]) =>
                    instance.logger.logAbility(message, ability, null, result)
                )
                .catch((error: Error) => {
                    instance.logger.logAbility(message, ability, error);
                    message.reply(`Woah that spectacularly didn\'t work out! Sure u were using it like this? ${prefix}${ability.name} ${ability.usage}`)
                        .catch((error: Error) => console.log(error));
                });
        }
    }

    public readonly fake_execute = (instance: Luna, command: string, _args: string[], message: Message): void => {
        // @ts-ignore
        const ability: Ability | null = instance.get(this, 'ability', command);
        if (ability instanceof Ability) ability.execute(message);
    }

    public readonly passive_execute = (instance: Luna, message: Message): void => {
        let ability: Ability | null;
        // @ts-ignore
        if (message.mentions.everyone) ability = instance.get(this, 'ability', 'reee');

        if (ability instanceof Ability)
            ability.execute(message)
                .then((result: Message | Message[]) => {
                    instance.logger.logAbility(message, ability, null, result);
                })
                .catch((err: Error) => console.log(err));
    }

    public readonly setting = (instance: Luna, command: string, _args: string[], message: Message) => {
        //
    }
}

export const trait: Listener = new MessageAdd();