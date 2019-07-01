import { Luna } from '../luna';
export declare class Listener {
    name: string;
    description: string;
    body: (instance: Luna) => () => void;
}
