import { Listener } from "./template.listener";
import { Luna } from "../luna";
import { MessageReaction, User, Client } from "discord.js";


class ReactionAdd extends Listener {
    public readonly name: string = 'messageReactionAdd';
    public readonly description: string = 'Listener for message reaction event.';

    public readonly body = (instance: Luna): () => void => {
        return () => {
            // @ts-ignore
            const client = instance.get(this, 'client');
            if (client instanceof Client) {
                client.on(this.name, (reaction: MessageReaction, user: User) => {
                    // @ts-ignore
                    const listener = instance.get(this, 'listener', this.name);
                    if (listener instanceof Listener) listener.execute(instance, reaction, user);
                });
            }
        }
    }

    public readonly execute = (_instance: Luna, _command: string, _reaction: MessageReaction, _user: User): void => {
        // execute code after cast
    }
}

export const trait: Listener = new ReactionAdd();

