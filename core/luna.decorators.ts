import { Luna } from "./luna";
import { Ability } from "./abilities/template.ability";
import { Listener } from "./listeners/template.listener";
import { StorageWorker } from "./storage/luna.transactions";
import { Generic } from './types'



export function Validate () {
    return (_target: Object, _key: any, descriptor?: PropertyDescriptor): PropertyDescriptor => {
        const original = descriptor.value;
        descriptor.value = function(token: Luna|Ability|Listener|StorageWorker, property: string, ...args: any[]) {
            const translator: Generic = {'client': 'client', 'ability': 'abilities', 'listener': 'listeners'};
            if (Object.keys(translator).includes(property)) {
                let newArgs: any[] = [];
                newArgs.push(token);
                newArgs.push(translator[property]);
                args.forEach(item => newArgs.push(item));
                return original.apply(this, newArgs);
            }
            return new Error('Invalid property request.');
        }
        return descriptor;
    }
}

export function Authorize () {
    return (_target: Object, _key: any, descriptor?: PropertyDescriptor): PropertyDescriptor => {
        const original = descriptor.value;
        descriptor.value = function(token: Luna|Ability|Listener|StorageWorker, property: string, ...args: any[]) {
            if (token instanceof Luna || token instanceof Ability || token instanceof Listener || token instanceof StorageWorker){
                let newArgs: any[] = [];
                // newArgs.push(token);
                newArgs.push(property);
                args.forEach(item => newArgs.push(item));
                return original.apply(this, newArgs);
            }
            return new Error('Could not get client. Access is restricted.');
        }
        return descriptor;
    }
}

export function DbAuthorize() {
    return (_target: Object, _key: any, descriptor?: PropertyDescriptor) : PropertyDescriptor => {
        const original = descriptor.value;
        descriptor.value = function(token: Listener | Luna, property: string, ...args: any[]) {
            if (token instanceof Listener || token instanceof Luna) {
                let newArgs: any[] = [];
                newArgs.push(property);
                newArgs.push(args);
                return original.apply(this, newArgs);
            }
            return new Error('Could not verify source. Access is restricted');
        }
        return descriptor
    }
}