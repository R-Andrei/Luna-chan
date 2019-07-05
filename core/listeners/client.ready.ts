import { Listener } from "./template.listener";
import { Luna } from "../luna";
import { Client } from "discord.js";


class ClientReady extends Listener {
    public readonly name: string = 'ready';
    public readonly description: string = 'Listener for ready login event.';
    public readonly body = (instance: Luna): () => void => {
        return () => {
            const client = instance.get(this, 'client');
            if (client instanceof Client) {
                client.on(this.name, () => {
                    const listener = instance.get(this, 'listener', this.name);
                    if (listener instanceof Listener) listener.execute(instance);
                });
            }
        }
    }

    public readonly execute = (instance: Luna): void => {
        const client = instance.get(this, 'client');
        if (client instanceof Client) {
            console.log(`Logged in as ${client.user.tag}!`);
            client.user.setActivity('with your feelings');
        }
    }
}

export const trait: Listener = new ClientReady();