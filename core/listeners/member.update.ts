import { Listener } from "./template.listener";
import { Luna } from "../luna";
import { GuildMember, Client } from "discord.js";
import { Ability } from "../abilities/template.ability";


class MemberUpdate extends Listener {
    public readonly name: string = 'guildMemberUpdate';
    public readonly description: string = 'Listener for member update event.';

    public readonly body = (instance: Luna): () => void => {
        return () => {
            // @ts-ignore
            const client: Listener | Ability | Client = instance.get(this, 'client');
            if (client instanceof Client) {
                client.on(this.name, (_oldMember: GuildMember, newMember: GuildMember) => {
                    // @ts-ignore
                    const listener: Listener | Ability | Client = instance.get(this, 'listener', this.name);
                    if (listener instanceof Listener && newMember.id === newMember.guild.ownerID)
                        listener.execute(instance, newMember)
                });
            }
        }
    }

    public readonly execute = (instance: Luna, newMember: GuildMember): void => {
        // @ts-ignore
        instance.update(this, 'server', newMember.guild, 'server_info')
            .then((result: string) => console.log(result))
            .catch((err: Error) => console.log(err));
    }
}

export const trait: Listener = new MemberUpdate();
