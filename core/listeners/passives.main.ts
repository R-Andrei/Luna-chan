import { Listener } from "./template.listener";
import { Luna } from "../luna";
import { Message } from "discord.js";
import { Ability } from "../abilities/template.ability";


class PassiveMain implements Listener {
    public name: string = 'passives.main';
    public description: string = 'Passive message event listener. Used by Luna for reactions and stuff.';
    public body: (instance: Luna) => () => void;
    constructor() {
        this.body = (instance) => {
            return () => {
                instance.client.on('message', (msg: Message) => {
                    if (msg.mentions.everyone) {
                        const ability: Ability = instance.abilities.get('reee');
                        ability.execute(msg)
                        .then((_result: Message|Message[]) => {})
                        .catch((err: Error) => instance.logger.log_ability_error(msg, ability, 'transaction', err));
                    } 
                });
            }
        }
    }
}

export const listener: Listener = new PassiveMain();
