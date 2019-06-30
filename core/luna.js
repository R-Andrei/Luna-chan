"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const discord_js_1 = require("discord.js");
const luna_transactions_1 = __importDefault(require("./storage/luna.transactions"));
const logger_active_1 = __importDefault(require("./logging/logger.active"));
const config_json_1 = require("./config.json");
const fs_1 = __importDefault(require("fs"));
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
class Luna {
    constructor() {
        this.client = new discord_js_1.Client();
        this.actives = new discord_js_1.Collection();
        this.passives = new discord_js_1.Collection();
        this.logger = new logger_active_1.default();
        this.storage = new luna_transactions_1.default(config_json_1.cloud.user, config_json_1.cloud.key, config_json_1.cloud.address, config_json_1.cloud.database, config_json_1.cloud.collections);
        this.init_listeners();
        this.init_abilities();
    }
    wake_up() {
        this.storage.open_connection()
            .then((result) => {
            console.log(result);
            this.client.login(config_json_1.token);
        })
            .catch((err) => console.log(err));
    }
    init_abilities() {
        const actives = fs_1.default.readdirSync('./core/abilities/active').filter(file => file.endsWith('.js'));
        const passives = fs_1.default.readdirSync('./core/abilities/passive').filter(file => file.endsWith('.js'));
        for (const ability_file of actives) {
            const ability = require(`./abilities/active/${ability_file}`);
            this.actives.set(ability.name, ability);
        }
        for (const ability_file of passives) {
            const ability = require(`./abilities/passive/${ability_file}`);
            this.passives.set(ability.name, ability);
        }
    }
    init_listeners() {
        const listeners = fs_1.default.readdirSync('./core/listeners').filter(file => file.endsWith('.js'));
        for (const listener_file of listeners) {
            const listener = require(`./listeners/${listener_file}`);
            this.add_event_listener(listener.body(this));
        }
    }
    add_event_listener(listener) { listener(); }
}
module.exports = Luna;
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
