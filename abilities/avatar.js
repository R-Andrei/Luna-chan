function UserException(message) {
    this.message = message;
}

module.exports = {
    name: 'avatar',
    description: 'Sends poor quality jifs.',
    args: true,
    min_args: 1,
    usage: '@user_mention, or just !avatar',
    execute: (instance, message, args = []) => {
        if (args.length) {
            var target = args[0].slice(2, -1);
            if (target.startsWith("!")) target = target.slice(1)
        }
        console.log(target);
        const avatar = (args.length) ? `${instance.client.users.find(user => user.id == target).avatarURL}?size=2048` : `${message.author.avatarURL}?size=2048`;
        message.reply(avatar)
    }
}