const moment = require('moment');
const { prefix } = require('../config.json');


module.exports = {
    name: 'abilities.main',
    description: 'Main message listener. Used by all users for commands.',
    body: (instance) => {
        return () => {
            instance.client.on('message', msg => {
                if (msg.content.startsWith(prefix) && !msg.author.bot) {
                    const args = msg.content.slice(prefix.length).split(/\s+/);
                    const command = args.shift().toLowerCase();
                    if (instance.abilities.has(command)) {
                        const ability = instance.abilities.get(command);
                        if (ability.name == 'kys') instance.storage.worker.close_connection()
                            .then(result => console.log(result))
                            .catch(err => console.log(err));
                        ability.execute(msg, args)
                            .then(result => {
                                console.log([
                                    `\n${moment(new Date(msg.createdTimestamp)).format('YYYY-MM-DD, h:mm:ss a')}:`,
                                    `Succesfully casted ability ${prefix}${ability.name} for user ${msg.author.tag}.`,
                                    `\nResult on channel '${result.channel.name}' ${(msg.guild) ? 'of guild ' + "'" + msg.guild.name + "'" : '\n' }`
                                ].join(' '));
                                instance.storage.worker.push_row(msg, ability)
                                    .then(result => console.log(result));
                            })
                            .catch(err => {
                                console.log([
                                    `\n${moment(new Date(msg.createdTimestamp)).format('YYYY-MM-DD, h:mm:ss a')}: Error casting`,
                                    `ability '${ability.name}'`,
                                    `for user: ${msg.author.tag}`,
                                    `on channel '${msg.channel.name}'`,
                                    `${(msg.guild) ? 'of guild ' + "'" + msg.guild.name + "'" : '\n' }`,
                                    `Error info: ${err.message}`
                                ].join(' '));
                                msg.reply('Woah that spectacularly didn\'t work out! Sure u were using it like this?')
                                    .then(msg.reply(`${prefix}${ability.name} ${ability.usage}`))
                                    .catch(err => console.log(err));
                            });
                    }
                }
            });
        }
    }
}