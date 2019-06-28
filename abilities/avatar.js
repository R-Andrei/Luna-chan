module.exports = {
    name: 'avatar',
    description: 'Sends poor quality jifs.',
    args: true,
    min_args: 1,
    usage: '@user_mention, or just !avatar',
    execute: (message, args = []) => {
        const target = (args.length) ? args[0].replace(/[\<\@\!\>]+/, '') : null;
        const avatar = (args.length) ? `${message.client.users.find(user => user.id == target).avatarURL}?size=2048` : `${message.author.avatarURL}?size=2048`;
        message.reply(avatar)
            .then(sent => {
                console.log(`Sent an avatar to ${sent.author.tag}`);
                return 0;
            })
            .catch(err => {
                console.log(err);
                return -1
            });
    }
}