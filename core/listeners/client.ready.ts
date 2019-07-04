import { Listener } from "./template.listener";
import { Luna } from "../luna";


class ClientReady extends Listener {
    public readonly name: string = 'ready';
    public readonly description: string = 'Listener for ready login event.';
    public readonly body = (instance: Luna): void => {
        const listener = instance.getListener(this.name);
        listener.execute(instance);

    }

    public readonly execute = (instance: Luna): void => {
        console.log(`Logged in as ${instance.Client().user.tag}!`);
        instance.Client().user.setActivity('with your feelings');
    }
}

export const trait: Listener = new ClientReady();