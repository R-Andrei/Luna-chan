module.exports = {
    name: 'reee',
    description: '',
    args: false,
    min_args: 0,
    usage: 'uses itself',
    type: 'main',
    execute: async (message) => {
        return new Promise((resolve, reject) => {
            message.react('\u{1F621}')
                .then(message.channel.send(`Reee. Was that necessary :unamused:`)
                    .then(resolve('Done'))
                    .catch(err => reject(err))
                ).catch(err => reject(err));   
        });
    }
}