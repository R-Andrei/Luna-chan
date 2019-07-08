import { Client, Collection, Snowflake, Message, Guild, User } from 'discord.js';
import { cloud, token } from './config.json';
import { StorageWorker } from './storage/luna.transactions';
import { Logger } from './logging/logger.active';
import { readdirSync } from 'fs';
import { Ability } from './abilities/template.ability';
import { Listener } from './listeners/template.listener';
import { Authorize, Validate, DbAuthorize } from './luna.decorators';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


export class Luna {

    private readonly _client: Client = new Client();
    private readonly _storage: StorageWorker = new StorageWorker(cloud.user, cloud.key, cloud.address, cloud.database, cloud.collections);

    private _abilities: Collection<Snowflake, Ability> = new Collection();
    private _listeners: Collection<Snowflake, Listener> = new Collection();

    public readonly logger: Logger = new Logger(); //TODO make logger private

    constructor () {
        this.init_traits('abilities');
        this.init_traits('listeners');
    }

    public readonly activate = (): void => {
        // this._storage.open()
        //     .then((result: string) => {
        //         console.log(result);
                
        // })
        // .catch((err: Error) => console.log(err));
        this._client.login(token);
    }

    @Validate()
    @Authorize()
    public get(property: string, name?: string): Ability|Listener|Client {
        return (property === 'client') ? this[`_${property}`] : this[`_${property}`].get(name);
    }

    @Validate()
    @Authorize()
    public set(property: string, name: string, value: Ability|Listener): void {
        this[`_${property}`].set(name, value);
    }

    @DbAuthorize()
    public async update(property: string, ...args: any[]): Promise<string> {
        return new Promise((resolve, reject) => {
            this._storage[`update${property.charAt(0).toUpperCase() + property.slice(1)}`].apply(this._storage, args)
                .then((result: string) => resolve(result))
                .catch((error: Error) => reject(error));
        });
    }

    public readonly init_traits = (type: string): void => {
        const traits: string[] = readdirSync(`./core/${type}`)
            .filter((file: string) => {return (file.endsWith('.ts') && !file.startsWith('template'))});
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








/*
//fake private listener
var private_commands = {
    'channel': {
        'set': [1, function],
        'show': [0, function show_channel(channel) { client.channels.get(channel).send(`Look a hat- I mean channel: ${fake_parrot_channel.name}`); }]
    },
    'parrot': {
        'set': [1, function set_parrot(client, new_option, calling_channel, _available_channels) {
            if (new_option !== fake_listener || new_option === 'on' || new_option === 'off') {
                set_fake_listener(new_option);
                let emoji = ':slight_frown:';
                if (new_option === 'on') { emoji = ':slight_smile:'; }
                client.channels.get(calling_channel).send(`Kyuu~ Done! ${emoji}`);
            } else {
                client.channels.get(calling_channel).send('Do u have Alzheimers? :unamused:');
            }
        }],
        'status': [0, function(channel) { client.channels.get(channel).send(`U really have Alzheimers user-sama. :rolling_eyes: \nLuna-chan is **${fake_listener.toUpperCase()}**! :triumph:`) }]
    }
}
fake_parrot_channel = { type: 'channel', name: 'dream_chat', id: '332216552994635776' };
fake_listener = 'on';
set_fake_private_message_listener(client, private_commands);



helpers
for fake_parrot
const send_fake_message = (client, message) => {
    (fake_parrot_channel.type === 'channel') ? client.channels.get(fake_parrot_channel.id).send(message): client.fetchUser(fake_parrot_channel.id).then((user) => { user.send(message) });
}



const set_fake_current_channel = (target_channel, target_channel_id, target_type) => {
    fake_parrot_channel.name = target_channel;
    fake_parrot_channel.id = target_channel_id;
    fake_parrot_channel.type = target_type;
}

const set_fake_listener = (new_option) => { fake_listener = new_option; }


const channel_or_user = (target_channel, new_channel) => {
    let type = (target_channel === null) ? null : 'channel';
    return (target_channel.indexOf('@') === 0 || target_channel.indexOf('#') > 0) ? [(target_channel.indexOf('@') === 0) ? this.client.users.find(user => user.tag === target_channel.substring(1)) : this.client.users.find(user => user.tag === target_channel), 'user'] : [new_channel, type];
}


set_channel(message, target_channel) {
    var [new_channel, type] = (this.available_channels.indexOf(target_channel) >= 0) ? [this.client.channels.find(channel => channel.name === target_channel), 'channel'] : [null, null];
    [new_channel, type] = channel_or_user(this.client, target_channel, new_channel);
    if (new_channel === null) {
        message.channel.send("Couldn't find that... *thing* :expressionless:");
    } else if (new_channel.id === fake_parrot_channel.id) {
        message.channel.send('Wtf im already there. User-sama ur ***lame~~~*** :rolling_eyes:');
    } else {
        let new_channel_name = (type === 'channel') ? new_channel.name : new_channel.tag;
        set_fake_current_channel(new_channel_name, new_channel.id, type);
        message.channel.send('Kyuu~ Done. :3');
    }
}
*/
