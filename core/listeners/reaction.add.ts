import { Listener } from "./template.listener";
import { Luna } from "../luna";
import { MessageReaction, User } from "discord.js";


class ReactionAdd extends Listener {
    public readonly name: string = 'messageReactionAdd';
    public readonly description: string = 'Listener for message reaction event.';

    public readonly body = (instance: Luna): () => void => {
        return () => {
            instance.Client(this).on(this.name, (reaction: MessageReaction, user: User) => {
                const listener: Listener = instance.getListener(this.name);
                listener.execute(instance, reaction, user);
            });
        }
    }

    public readonly execute = (instance: Luna, command: string, reaction: MessageReaction, user: User): void => {
        console.log(instance, reaction, user, command);
    }
}

export const trait: Listener = new ReactionAdd();

