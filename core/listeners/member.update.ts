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
                instance.client.on('guildMemberUpdate', (_old_member: GuildMember, new_member: GuildMember) => {
                    if(new_member.id === new_member.guild.ownerID)
                        instance.storage.update_server(new_member.guild, 'server_info')
                            .then((result: string) => console.log(result))
                            .catch((err: Error) => console.log(err));
                });
            }
        }
    }
}

export const listener: Listener = new MemberUpdate();
