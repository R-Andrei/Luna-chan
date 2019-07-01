import { Listener } from "./template.listener";
import { Luna } from "../luna";


class ClientReady implements Listener {
    public name: string = 'client.ready';
    public description: string = 'Listener for ready login event.';
    public body: (instance: Luna) => () => void;
    constructor() {
        this.body = (instance) => {
            return () => {
                instance.client.on('ready', () => {
                    console.log(`Logged in as ${instance.client.user.tag}!`);
                    instance.client.user.setActivity('with your feelings');
                });
            }
        }
    }
}

export const listener: Listener = new ClientReady();