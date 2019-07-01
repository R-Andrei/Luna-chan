import { Message } from 'discord.js';
import { Ability } from '../abilities/template.ability.js';
export declare class Logger {
    private actions;
    constructor();
    log_ability_error(message: Message, ability: Ability, action: string, error: Error): void;
    log_ability_success(result: Message | Array<Message>, message: Message, ability: Ability): void;
}
