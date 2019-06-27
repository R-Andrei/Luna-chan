module.exports = {
    name: 'invite',
    description: 'Sends an invite link for awesome Luna.',
    args: false,
    min_args: 0,
    usage: '',
    execute: (instance, message) => {
        instance.client.generateInvite(67611712).then(response => {
            message.reply(response);
        }).catch(err => {
            message.reply(`Oops! Something didn't work out. ${err}`)
        });
    }
}