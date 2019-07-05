import { Listener } from "./template.listener";
import { Luna } from "../luna";
import { Guild, Client } from "discord.js";
import { Ability } from "../abilities/template.ability";


class GuildJoin extends Listener {
    public readonly name: string = 'guildCreate';
    public readonly description: string = 'Listener for guild join event.';

    public readonly body = (instance: Luna): () => void => {
        return () => {
            const client: Ability | Listener | Client = instance.get(this, 'client');
            if (client instanceof Client) {
                client.on(this.name, (guild: Guild) => {
                    const listener: Ability | Listener | Client = instance.get(this, 'listener', this.name);
                    if (listener instanceof Listener) listener.execute(instance, guild);
                });
            }
        }
    }

    public readonly execute = (instance: Luna, guild: Guild): void => {
        // instance.storage.update_server(guild, 'server_info')
        //     .then((result: string) => console.log(result))
        //     .catch((err: Error) => console.log(err)); //TODO private storage access
    }
}

export const trait: Listener = new GuildJoin();

