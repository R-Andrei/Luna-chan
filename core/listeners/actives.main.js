const { prefix } = require('../prefixes.json');

module.exports = {
    name: 'actives.main',
    description: 'Main message listener. Used by all users for commands.',
    body: (instance) => {
        return () => {
            instance.client.on('message', msg => {
                if (msg.content.startsWith(prefix) && !msg.author.bot) {
                    const args = msg.content.slice(prefix.length).split(/\s+/);
                    const command = args.shift().toLowerCase();
                    if (instance.actives.find(item => { return item.name === command && item.type === 'main'; })) {
                        const ability = instance.actives.get(command);
                        ability.execute(msg, args)
                            .then(result => {
                                instance.logger.log_ability_success(result, msg, ability);
                                instance.storage.record_cast(msg, ability)
                                    .then(result => console.log(result))
                                    .catch(err => instance.logger.log(msg, ability, 'transaction', err));
                                
                            })
                            .catch(err => {
                                instance.logger.log_ability_error(msg, ability, 'ability', err);
                                msg.reply(`Woah that spectacularly didn\'t work out! Sure u were using it like this? ${prefix}${ability.name} ${ability.usage}`)
                                    .catch(err => console.log(err));
                            });
                    }
                }
            });
        }
    }
}