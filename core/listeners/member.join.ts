import { Listener } from "./template.listener";
import { Luna } from "../luna";
import { GuildMember, Client } from "discord.js";
import { Ability } from "../abilities/template.ability";


class MemberJoin extends Listener {
    public readonly name: string = 'guildMemberAdd';
    public readonly description: string = 'Listener for member join event.';

    public readonly body = (instance: Luna): () => void => {
        return () => {
            // @ts-ignore
            const client: Listener | Ability | Client = instance.get(this, 'client');
            if (client instanceof Client) {
                client.on(this.name, (member: GuildMember) => {
                    // @ts-ignore
                    const listener: Listener | Ability | Client = instance.get(this, 'listener', this.name);
                    if (listener instanceof Listener) listener.execute(instance, member);
                });
            }
        }
    }

    public readonly execute = (instance: Luna, member: GuildMember): void => {
        // @ts-ignore
        instance.update(this, 'server', member.guild, 'server_info')
            .then((result: string) => console.log(result))
            .catch((err: Error) => console.log(err));
    }
}

export const trait: Listener = new MemberJoin();
