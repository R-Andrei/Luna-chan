import { Listener } from "./template.listener";
import { Luna } from "../luna";
import { Guild, Client } from "discord.js";
import { Ability } from "../abilities/template.ability";


class GuildJoin extends Listener {
    public readonly name: string = 'guildCreate';
    public readonly description: string = 'Listener for guild join event.';

    public readonly body = (instance: Luna): () => void => {
        return () => {
            // @ts-ignore
            const client: Ability | Listener | Client = instance.get(this, 'client');
            if (client instanceof Client) {
                client.on(this.name, (guild: Guild) => {
                    // @ts-ignore
                    const listener: Ability | Listener | Client = instance.get(this, 'listener', this.name);
                    if (listener instanceof Listener) listener.execute(instance, guild);
                });
            }
        }
    }

    public readonly execute = (_instance: Luna, guild: Guild): void => {
        // execute code after cast
        // @ts-ignore
        // instance.update(this, 'serber', guild, 'server_info')
        //     .then((result: string) => console.log(result))
        //     .catch((err: Error) => console.log(err));
    }
}

export const trait: Listener = new GuildJoin();

