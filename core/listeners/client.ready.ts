import { Listener } from "./template.listener";
import { Luna } from "../luna";


class ClientReady extends Listener {
    public readonly name: string = 'ready';
    public readonly description: string = 'Listener for ready login event.';
    public readonly body = (instance: Luna): () => void => {
        return () => {
            instance.Client(this).on(this.name, () => {
                const listener = instance.getListener(this, this.name);
                listener.execute(instance);
            });
        }
    }

    public readonly execute = (instance: Luna): void => {
        console.log(`Logged in as ${instance.Client(this).user.tag}!`);
        instance.Client(this).user.setActivity('with your feelings');
    }
}

export const trait: Listener = new ClientReady();