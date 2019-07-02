import { Listener } from "./template.listener";
import { Luna } from "../luna";
import { GuildMember } from "discord.js";


class MemberUpdate implements Listener {
    public name: string = 'member.update';
    public description: string = 'Listener for member update event.';
    public body: (instance: Luna) => () => void;
    constructor() {
        this.body = (instance) => {
            return () => {
                instance.client.on('guildMemberUpdate', (_oldMember: GuildMember, newMember: GuildMember) => {
                    const listener: Listener = instance.listeners.get('member.update');
                    if (newMember.id === newMember.guild.ownerID) listener.execute(instance, newMember)
                });
            }
        }
    }

    public execute = (instance: Luna, newMember: GuildMember): void => {
        instance.storage.update_server(newMember.guild, 'server_info')
            .then((result: string) => console.log(result))
            .catch((err: Error) => console.log(err));
    }
}

export const listener: Listener = new MemberUpdate();
