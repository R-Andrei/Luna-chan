import { Luna } from "./luna";
import { Ability } from "./abilities/template.ability";
import { Listener } from "./listeners/template.listener";
import { StorageWorker } from "./storage/luna.transactions";
import { Generic } from './types'


export function Validate () {
    return (_target: Object, _key: any, descriptor?: PropertyDescriptor): PropertyDescriptor => {
        const original = descriptor.value;
        descriptor.value = function(token: Luna|Ability|Listener|StorageWorker, property: string, ...args: any[]) {
            const translator: Generic = {'client': 'client', 'ability|abilities': 'abilities', 'listeners': 'listeners'};
            const result = Object.keys(translator).find(key => {
                if (key.includes(property)) return key;
            });
            if (result) {
                let newArgs: any[] = [];
                newArgs.push(token);
                newArgs.push(translator[result]);
                args.forEach(item => newArgs.push(item));
                return original.apply(this, newArgs);
            }
           else return new Error('Invalid property request.')
        }
        return descriptor;
    }
}

export function Authorize () {
    return (_target: Object, _key: any, descriptor?: PropertyDescriptor): PropertyDescriptor => {
        const original = descriptor.value;
        descriptor.value = function(token: Luna|Ability|Listener|StorageWorker, ...args: any[]) {
            if (token instanceof Luna || token instanceof Ability || token instanceof Listener || token instanceof StorageWorker){
                return original.apply(this, args);
            }
            else return new Error('Could not get client. Access is restricted.');
        }
        return descriptor;
    }
}
