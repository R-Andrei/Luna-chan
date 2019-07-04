import { Listener } from "./template.listener";
import { Luna } from "../luna";
import { Guild } from "discord.js";


class GuildUpdate extends Listener {
    public readonly name: string = 'guildUpdate';
    public readonly description: string = 'Listener for guild update event.';

    public readonly body = (instance: Luna, _oldGuild: Guild, newGuild: Guild) => {
        const listener: Listener = instance.getListener(this.name);
        listener.execute(instance, newGuild);
    }

    public readonly execute = (instance: Luna, newGuild: Guild): void => {
        // instance.storage.update_server(newGuild, 'server_info')
        //     .then((result: string) => console.log(result))
        //     .catch((err: Error) => console.log(err)); //TODO private storage access
    }
}

export const trait: Listener = new GuildUpdate();

