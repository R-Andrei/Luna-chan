module.exports = {
    name: 'member.join',
    description: 'Listener for ready login event.',
    body: (instance) => {
        return () => {
            instance.client.on('guildMemberAdd', (member) => {
                instance.storage.update_server(member.guild, 'server_info')
                    .then(result => console.log(result))
                    .catch(err => console.log(err));
            });
        }
    }
}