import { Client, Collection, Snowflake } from 'discord.js';
import { readdirSync } from 'fs';



import { Listener } from './listeners/template.listener';
import { Ability } from './abilities/template.ability';
import { Authorize, Validate } from './luna.decorators';
import { Logger } from './logging/logging'
import { TOKEN } from '../config';
import { Db } from './logging/db';


export class Luna {

    private readonly _client: Client = new Client();
    private readonly _database: Db = new Db();

    private _abilities: Collection<Snowflake, Ability> = new Collection();
    private _listeners: Collection<Snowflake, Listener> = new Collection();

    public readonly logger: Logger = new Logger(this, this._database);

    constructor() {
        this.init_traits('abilities');
        this.init_traits('listeners');
    }

    public readonly activate = (): void => {
        this._client.login(TOKEN)
            .then((_: string) => {
                this._client.user.setActivity('with your feelings');
                console.log('Logged in as Luna-Chan!');
            })
            .catch((error) => console.log(error));
        this._database.connect()
            .then((_: boolean) => console.log('Connected to db!'))
            .catch(error => console.log(error));
    }

    @Validate()
    @Authorize()
    public get(property: string, name?: string): Ability | Listener | Client | Collection<Snowflake, Ability> {
        return (name === undefined) ? (this[`_${property}`]) :
            ((this[`_${property}`] instanceof Collection) ? this[`_${property}`].get(name) : this[`_${property}`][name]);
    }

    @Validate()
    @Authorize()
    public set(property: string, name: string, value: Ability | Listener): void {
        this[`_${property}`].set(name, value);
    }

    public readonly init_traits = (type: string): void => {
        const traits: string[] = readdirSync(`./core/${type}`)
            .filter((file: string) => { return (file.endsWith('.ts') && !file.startsWith('template')) });
        for (let traitFile of traits) {
            import(`./${type}/${traitFile.replace(/\.ts$/s, '')}`)
                .then((file: any) => {
                    const trait: Listener | Ability = file.trait;
                    this[`_${type}`].set(trait.name, trait);
                    if (trait instanceof Listener) this.addListener(trait.body(this));
                });
        }
    }

    public readonly addListener = (listener: () => void): void => { listener(); }

}
