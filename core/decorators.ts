import { Luna } from "./luna";
import { Ability } from "./abilities/template.ability";
import { Listener } from "./listeners/template.listener";
import { StorageWorker } from "./storage/luna.transactions";


export function Validator () {
    return (target: Object, key: any, descriptor?: PropertyDescriptor): PropertyDescriptor => {
        console.log(target, key);
        const original = descriptor.value;
        descriptor.value = function(token: Luna|Ability|Listener|StorageWorker, ...args: any[]) {console.log(token);
            if (token instanceof Luna || token instanceof Ability || token instanceof Listener || token instanceof StorageWorker){
                let newArgs: any[] = [];
                newArgs.push(token)
                args.forEach(item => newArgs.push(item));
                return original.apply(this, newArgs);
            }
                
            return new Error('Could not get client. Access is restricted.');
        }
        return descriptor;
    }
}