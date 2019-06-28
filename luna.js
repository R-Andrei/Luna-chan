const Discord = require('discord.js');
const fs = require('fs');
const moment = require('moment');
const { prefix, token } = require('./config.json');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

class Luna {
    constructor(token) {
        this.client = new Discord.Client();
        this.abilities = new Discord.Collection();

        this.database = require('./storage/luna_transactions');

        this.wake_up();

        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
            this.client.user.setActivity('with your feelings');
        });

        try { this.client.login(token); } catch (err) { console.log(err.message); }
    }

    wake_up() {
        const abilities = fs.readdirSync('./abilities').filter(file => file.endsWith('.js'));
        for (const ability_file of abilities) {
            const ability = require(`./abilities/${ability_file}`);
            this.abilities.set(ability.name, ability);
        }
    }

    add_event_listener(listener) {
        listener();
    }
}

const main_message_listener = (instance) => {
    return () => {
        instance.client.on('message', msg => {
            if (msg.content.startsWith(prefix) && !msg.author.bot) {
                const args = msg.content.slice(prefix.length).split(/\s+/);
                const command = args.shift().toLowerCase();
                if (instance.abilities.has(command)) {
                    const ability = instance.abilities.get(command);
                    ability.execute(msg, args)
                        .then(result => {
                            console.log([
                                `\n${moment(new Date(msg.createdTimestamp)).format('YYYY-MM-DD, h:mm:ss a')}: Succesfully used ability ${prefix}${ability.name} for user ${msg.author.tag}.`,
                                `Result on channel '${result.channel.name}' ${(msg.guild) ? 'of guild ' + "'" + msg.guild.name + "'" : '\n' }`
                            ].join('\n'));
                            instance.database.worker.update_user(msg, [ability])
                                .then(result => console.log(result))
                                .catch(err => console.log(err));
                        })
                        .catch(err => {
                            console.log([
                                `\n${moment(new Date(msg.createdTimestamp)).format('YYYY-MM-DD, h:mm:ss a')}: Error running`,
                                `command '${ability.name}'`,
                                `for user: ${msg.author.tag}`,
                                `on channel '${msg.channel.name}'`,
                                `${(msg.guild) ? 'of guild ' + "'" + msg.guild.name + "'" : '\n' }`,
                                `Error info: ${err.message}`
                            ].join(' '));
                            msg.reply('Woah that spectacularly didn\'t work out! Sure u were using it like this?');
                            msg.reply(`${prefix}${ability.name} ${ability.usage}`);
                        });
                }
            }
        });
    }
}

let ko = new Luna(token);
ko.add_event_listener(main_message_listener(ko));




// //fake private listener
// var private_commands = {
//     'channel': {
//         'set': [1, function],
//         'show': [0, function show_channel(channel) { client.channels.get(channel).send(`Look a hat- I mean channel: ${fake_parrot_channel.name}`); }]
//     },
//     'parrot': {
//         'set': [1, function set_parrot(client, new_option, calling_channel, _available_channels) {
//             if (new_option !== fake_listener || new_option === 'on' || new_option === 'off') {
//                 set_fake_listener(new_option);
//                 let emoji = ':slight_frown:';
//                 if (new_option === 'on') { emoji = ':slight_smile:'; }
//                 client.channels.get(calling_channel).send(`Kyuu~ Done! ${emoji}`);
//             } else {
//                 client.channels.get(calling_channel).send('Do u have Alzheimers? :unamused:');
//             }
//         }],
//         'status': [0, function(channel) { client.channels.get(channel).send(`U really have Alzheimers user-sama. :rolling_eyes: \nLuna-chan is **${fake_listener.toUpperCase()}**! :triumph:`) }]
//     }
// }
// fake_parrot_channel = { type: 'channel', name: 'dream_chat', id: '332216552994635776' };
// fake_listener = 'on';
// set_fake_private_message_listener(client, private_commands);



// helpers
// for fake_parrot
// const send_fake_message = (client, message) => {
//     (fake_parrot_channel.type === 'channel') ? client.channels.get(fake_parrot_channel.id).send(message): client.fetchUser(fake_parrot_channel.id).then((user) => { user.send(message) });
// }



// const set_fake_current_channel = (target_channel, target_channel_id, target_type) => {
//     fake_parrot_channel.name = target_channel;
//     fake_parrot_channel.id = target_channel_id;
//     fake_parrot_channel.type = target_type;
// }

// const set_fake_listener = (new_option) => { fake_listener = new_option; }


// const channel_or_user = (target_channel, new_channel) => {
//     let type = (target_channel === null) ? null : 'channel';
//     return (target_channel.indexOf('@') === 0 || target_channel.indexOf('#') > 0) ? [(target_channel.indexOf('@') === 0) ? this.client.users.find(user => user.tag === target_channel.substring(1)) : this.client.users.find(user => user.tag === target_channel), 'user'] : [new_channel, type];
// }

// const set_fake_private_message_listener = (instance) => {
//     instance.client.on('message', msg => {
//         if (msg.author.tag === 'Fake#1000' && msg.channel.id === '588668921075335178') {
//             if (msg.content === '!!terminate') {}
//             if (msg.content.charAt(0) === '!') {
//                 let split = msg.content.split(' ');


//             } else if (fake_listener === 'on') {
//                 (msg.content.charAt(0) === '\\') ? send_fake_message(client, msg.content.substring(1)): send_fake_message(client, msg.content);
//             }
//         }
//     });
// }

// set_channel(message, target_channel) {
//     var [new_channel, type] = (this.available_channels.indexOf(target_channel) >= 0) ? [this.client.channels.find(channel => channel.name === target_channel), 'channel'] : [null, null];
//     [new_channel, type] = channel_or_user(this.client, target_channel, new_channel);
//     if (new_channel === null) {
//         message.channel.send("Couldn't find that... *thing* :expressionless:");
//     } else if (new_channel.id === fake_parrot_channel.id) {
//         message.channel.send('Wtf im already there. User-sama ur ***lame~~~*** :rolling_eyes:');
//     } else {
//         let new_channel_name = (type === 'channel') ? new_channel.name : new_channel.tag;
//         set_fake_current_channel(new_channel_name, new_channel.id, type);
//         message.channel.send('Kyuu~ Done. :3');
//     }
// }