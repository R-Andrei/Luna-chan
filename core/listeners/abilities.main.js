const { prefix } = require('../prefixes.json');

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
                        if (ability.name == 'kys') instance.storage.close_connection()
                            .then(result => console.log(result))
                            .catch(err => console.log(err));
                        ability.execute(msg, args)
                            .then(result => {
                                instance.logger.log_success(result, msg, ability);
                                instance.storage.push_row(msg, ability)
                                    .then(result => console.log(result))
                                    .catch(err => instance.logger.log(msg, ability, 'transaction', err));
                            })
                            .catch(err => {
                                instance.logger.log_error(msg, ability, 'ability', err);
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