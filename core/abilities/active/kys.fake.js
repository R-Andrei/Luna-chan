module.exports = {
    name: 'kys',
    description: 'makes Luna kill self',
    args: false,
    min_args: 0,
    usage: '',
    type: 'fake',
    execute: async (message, args) => {
        return new Promise((_resolve, reject) => {
            if (args.length) message.reply(`What'd you give me those for? '${args.join(', ')}'`).catch(err => console.log(err));
            return message.reply('Hold on im gonna go kms.')
                .then(sent => {
                    console.log(`Killed myself per ${sent.author.tag}'s instructions.`);
                    process.exit();
                })
                .catch(err => reject(err));
        });
    }
}