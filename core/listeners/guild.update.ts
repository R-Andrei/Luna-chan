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
                instance.client.on('guildUpdate', (_old_guild: Guild, new_guild: Guild) => {
                    instance.storage.update_server(new_guild, 'server_info')
                        .then((result: string) => console.log(result))
                        .catch((err: Error) => console.log(err));
                });
            }
        }
    }
}

export const listener: Listener = new GuildUpdate();

