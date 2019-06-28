module.exports = {
    name: 'avatar',
    description: 'Sends poor quality jifs.',
    args: true,
    min_args: 1,
    usage: '@user_mention, or just !avatar',
    execute: (message, args = []) => {
        return new Promise((resolve, reject) => {
            const target = (args.length) ? args[0].replace(/[\<\@\!\>]+/g, '') : null;
            const avatar = (args.length) ? `${message.client.users.find(user => user.id == target).avatarURL}?size=2048` : `${message.author.avatarURL}?size=2048`;
            message.reply(avatar)
                .then(sent => resolve(sent))
                .catch(err => reject(err));
        });


    }
}