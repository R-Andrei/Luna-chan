import { Luna } from '../luna'

export class Listener {
    public name: string;
    public description: string;
    public body: (instance: Luna) => () => void;
}