module.exports = {
    name: 'avatar',
    description: 'Sends poor quality jifs.',
    args: true,
    min_args: 1,
    usage: '@user_mention, or just !avatar',
    execute: (instance, message, args = []) => {
        const target = (args.length) ? args[0].replace(/[\<\@\!\>]+/, '') : null;
        const avatar = (args.length) ? `${instance.client.users.find(user => user.id == target).avatarURL}?size=2048` : `${message.author.avatarURL}?size=2048`;
        return message.reply(avatar)
    }
}