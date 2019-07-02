import { Listener } from "./template.listener";
import { Luna } from "../luna";
import { Guild } from "discord.js";


class GuildJoin implements Listener {
    public name: string = 'guild.join';
    public description: string = 'Listener for guild join event.';
    public body: (instance: Luna) => () => void;
    constructor() {
        this.body = (instance) => {
            return () => {
                instance.client.on('guildCreate', (guild: Guild) => {
                    const listener = instance.listeners.get('guild.join');
                    listener.execute(instance, guild);
                });
            }
        }
    }

    public execute = (instance: Luna, guild: Guild): void => {
        instance.storage.update_server(guild, 'server_info')
            .then((result: string) => console.log(result))
            .catch((err: Error) => console.log(err));
    }
}

export const listener: Listener = new GuildJoin();

