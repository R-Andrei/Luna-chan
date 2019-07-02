import { Listener } from "./template.listener";
import { Luna } from "../luna";
import { Guild } from "discord.js";


class GuildUpdate implements Listener {
    public name: string = 'guild.update';
    public description: string = 'Listener for guild update event.';
    public body: (instance: Luna) => () => void;
    constructor() {
        this.body = (instance) => {
            return () => {
                instance.client.on('guildUpdate', (_oldGuild: Guild, newGuild: Guild) => {
                    const listener: Listener = instance.listeners.get('guild.update');
                    listener.execute(instance, newGuild);
                });
            }
        }
    }

    public execute = (instance: Luna, newGuild: Guild): void => {
        instance.storage.update_server(newGuild, 'server_info')
            .then((result: string) => console.log(result))
            .catch((err: Error) => console.log(err));
    }
}

export const listener: Listener = new GuildUpdate();

