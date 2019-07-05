import { Listener } from "./template.listener";
import { Luna } from "../luna";
import { Guild } from "discord.js";


class GuildJoin extends Listener {
    public readonly name: string = 'guildCreate';
    public readonly description: string = 'Listener for guild join event.';

    public readonly body = (instance: Luna): () => void => {
        return () => {
            instance.Client(this).on(this.name, (guild: Guild) => {
                const listener = instance.getListener(this, this.name);
                listener.execute(instance, guild);
            });
        }
    }

    public readonly execute = (instance: Luna, guild: Guild): void => {
        // instance.storage.update_server(guild, 'server_info')
        //     .then((result: string) => console.log(result))
        //     .catch((err: Error) => console.log(err)); //TODO private storage access
    }
}

export const trait: Listener = new GuildJoin();

