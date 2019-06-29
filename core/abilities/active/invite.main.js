module.exports = {
    name: 'invite',
    description: 'Sends an invite link for awesome Luna.',
    args: false,
    min_args: 0,
    usage: '',
    type: 'main',
    execute: async (message, args) => {
        return new Promise((resolve, reject) => {
            if (args.length) message.reply(`What'd you give me those for? '${args.join(', ')}'`).catch(err => console.log(err));
            message.client.generateInvite(67611712).then(response => {
                message.reply(response)
                    .then(sent => resolve(sent));
            }).catch(err => reject(err));
        });
    }
}