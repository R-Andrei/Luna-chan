import { Listener } from "./template.listener";
import { Luna } from "../luna";
import { MessageReaction, User } from "discord.js";


class ReactionMain implements Listener {
    public name: string = 'reaction.main';
    public description: string = 'Listener for message reaction event.';
    public body: (instance: Luna) => () => void;
    constructor() {
        this.body = (instance) => {
            return () => {
                instance.client.on('messageReactionAdd', (reaction: MessageReaction, user: User) => {
                    console.log(reaction, user);
                });
            }
        }
    }
}

export const listener: Listener = new ReactionMain();

