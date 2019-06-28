module.exports = {
    name: 'invite',
    description: 'Sends an invite link for awesome Luna.',
    args: false,
    min_args: 0,
    usage: '',
    execute: (message, args) => {
        if (args != []) message.reply(`What'd you give me those for? '${args.join(', ')}'`).catch(err => console.log(err));
        message.client.generateInvite(67611712).then(response => {
            message.reply(response)
                .then(sent => {
                    console.log(`Sent reply to ${sent.author.tag}.`);
                    return 0;
                });
        }).catch(err => { console.log(err); return -1; });
    }
}