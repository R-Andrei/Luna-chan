import { Listener } from "./template.listener";
import { Luna } from "../luna";
import { GuildMember } from "discord.js";


class MemberUpdate extends Listener {
    public readonly name: string = 'guildMemberUpdate';
    public readonly description: string = 'Listener for member update event.';

    public readonly body = (instance: Luna): () => void => {
        return () => {
            instance.Client(this).on(this.name, (_oldMember: GuildMember, newMember: GuildMember) => {
                const listener: Listener = instance.getListener(this, this.name);
                if (newMember.id === newMember.guild.ownerID) listener.execute(instance, newMember)
            });
        }
    }

    public readonly execute = (instance: Luna, newMember: GuildMember): void => {
        // instance.storage.update_server(newMember.guild, 'server_info') #TODO private storage access
        //     .then((result: string) => console.log(result))
        //     .catch((err: Error) => console.log(err));
    }
}

export const trait: Listener = new MemberUpdate();
