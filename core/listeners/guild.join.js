module.exports = {
    name: 'guild.join',
    description: 'Listener for ready login event.',
    body: (instance) => {
        return () => {
            instance.client.on('guildCreate', (guild) => {
                instance.storage.update_server(guild, 'server_info')
                    .then(result => console.log(result))
                    .catch(err => console.log(err));
            });
        }
    }
}