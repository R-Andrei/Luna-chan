module.exports = {
    name: 'reee',
    description: '',
    args: false,
    min_args: 0,
    usage: 'uses itself',
    type: 'main',
    execute: async (message) => {
        return new Promise((resolve, reject) => {
            message.react('regional_indicator_r')
            .then(message.react('regional_indicator_e')
                .then(message.react('exclamation')
                    .then(resolve(`Successfully reacted to ${message.author.tag}'s mention of everyone.`))
                    .catch(err => reject(err))
                ).catch(err => reject(err))
            ).catch(err => reject(err))
        });
    }
}