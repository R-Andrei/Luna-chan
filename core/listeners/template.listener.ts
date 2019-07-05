import { Luna } from '../luna'

export class Listener {
    public readonly name: string;
    public readonly description: string;
    public readonly body: (instance: Luna) => () => void;
    public readonly execute: (instance: Luna, ...args: any[]) => any;
    
}