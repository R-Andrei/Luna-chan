import { Listener } from "./template.listener";
import { Luna } from "../luna";
import { Guild, Client } from "discord.js";
import { Ability } from "../abilities/template.ability";


class GuildUpdate extends Listener {
    public readonly name: string = 'guildUpdate';
    public readonly description: string = 'Listener for guild update event.';

    public readonly body = (instance: Luna): () => void => {
        return () => {
            // @ts-ignore
            const client: Ability | Listener | Client = instance.get(this, 'client');
            if (client instanceof Client) {
                client.on(this.name, (_oldGuild: Guild, newGuild: Guild) => {
                    // @ts-ignore
                    const listener: Ability | Listener | Client = instance.get(this, 'listener', this.name);
                    if (listener instanceof Listener) listener.execute(instance, newGuild);
                });
            }
        }
    }

    public readonly execute = (instance: Luna, newGuild: Guild): void => {
        // @ts-ignore
        instance.update(this, 'server', newGuild, 'server_info')
            .then((result: string) => console.log(result))
            .catch((err: Error) => console.log(err));
    }
}

export const trait: Listener = new GuildUpdate();

