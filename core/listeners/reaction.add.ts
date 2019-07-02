import { Listener } from "./template.listener";
import { Luna } from "../luna";
import { MessageReaction, User } from "discord.js";


class ReactionAdd extends Listener {
    public name: string = 'reaction.add';
    public description: string = 'Listener for message reaction event.';
    public body: (instance: Luna) => () => void;
    constructor() {
        super();
        this.body = (instance) => {
            return () => {
                instance.client.on('messageReactionAdd', (reaction: MessageReaction, user: User) => {
                    const listener: Listener = instance.listeners.get('reaction.add');
                    listener.execute(instance, reaction, user);
                });
            }
        }
    }

    public execute = (instance: Luna, command: string, reaction: MessageReaction, user: User): void => {
        console.log(instance, reaction, user, command);
    }
}

export const listener: Listener = new ReactionAdd();

