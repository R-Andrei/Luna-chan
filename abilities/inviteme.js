module.exports = {
    name: 'invite',
    description: 'Sends an invite link for awesome Luna.',
    args: false,
    min_args: 0,
    usage: '',
    execute: (instance, message) => {
        instance.client.generateInvite(67611712).then(response => {
            message.reply(response)
                .then(sent => {
                    console.log(`Sent reply to ${sent.author.tag}.`);
                    return 0;
                });
        }).catch(err => { console.log(err); return -1; });
    }
}