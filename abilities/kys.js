module.exports = {
    name: 'kys',
    description: 'makes Luna kill self',
    args: false,
    min_args: 0,
    usage: '',
    execute: (_instance, message) => {
        return message.reply('Hold on im gonna go kms.')
            .then(sent => {
                console.log(`Killed myself per ${sent.author.tag}'s instructions.`);
                process.exit();
            })
            .catch(err => { console.log(err); return -1; });
    }
}