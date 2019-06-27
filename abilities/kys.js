module.exports = {
    name: 'kys',
    description: 'makes Luna kill self',
    args: false,
    min_args: 0,
    usage: '',
    execute: (_instance, message) => {
        message.reply('Hold on im gonna go kms.').then(process.exit());;
    }
}