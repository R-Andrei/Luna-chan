import { Listener } from "./template.listener";
import { Luna } from "../luna";
import { GuildMember } from "discord.js";


class MemberJoin implements Listener {
    public name: string = 'member.join';
    public description: string = 'Listener for member join event.';
    public body: (instance: Luna) => () => void;
    constructor() {
        this.body = (instance) => {
            return () => {
                instance.client.on('guildMemberAdd', (member: GuildMember) => {
                    instance.storage.update_server(member.guild, 'server_info')
                        .then((result: string) => console.log(result))
                        .catch((err: Error) => console.log(err));
                });
            }
        }
    }
}

export const listener: Listener = new MemberJoin();
