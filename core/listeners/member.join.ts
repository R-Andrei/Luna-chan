import { Listener } from "./template.listener";
import { Luna } from "../luna";
import { GuildMember } from "discord.js";


class MemberJoin extends Listener {
    public readonly name: string = 'guildMemberAdd';
    public readonly description: string = 'Listener for member join event.';

    public readonly body = (instance: Luna): () => void => {
        return () => {
            instance.Client(this).on(this.name, (member: GuildMember) => {
                const listener: Listener = instance.getListener(this.name);
                listener.execute(instance, member);
            });
        }
    }

    public readonly execute = (instance: Luna, member: GuildMember): void => {
        // instance.storage.update_server(member.guild, 'server_info')
        //     .then((result: string) => console.log(result))
        //     .catch((err: Error) => console.log(err)); //TODO PRIVATE STORAGE ACCESS
    }
}

export const trait: Listener = new MemberJoin();
