module.exports = {
    name: 'guild.join',
    description: 'Listener for ready login event.',
    body: (instance) => {
        return () => {
            instance.client.on('guildUpdate', (_old_guild, new_guild) => {
                instance.storage.update_server(new_guild, 'server_info')
                    .then(result => console.log(result))
                    .catch(err => console.log(err));
            });
        }
    }
}