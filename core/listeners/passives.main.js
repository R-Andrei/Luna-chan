module.exports = {
    name: 'passives.main',
    description: 'Passive message event listener. Used by Luna for reactions and stuff.',
    body: (instance) => {
        return () => {
            instance.client.on('message', msg => {
                if (msg.mentions.everyone) instance.passives.get('reee').execute(msg)
                    .then(result => console.log(result))
                    .catch(err => instance.logger.log(msg, ability, 'transaction', err));
                
            });
        }
    }
}