module.exports = {
    name: 'member.update',
    description: 'Listener for ready login event.',
    body: (instance) => {
        return () => {
            instance.client.on('guildMemberUpdate', (_old_member, new_member) => {
                if(new_member.id === new_member.guild.ownerID)
                    instance.storage.update_server(new_member.guild, 'server_info')
                        .then(result => console.log(result))
                        .catch(err => console.log(err));
            });
        }
    }
}