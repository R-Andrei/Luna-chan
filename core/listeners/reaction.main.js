
module.exports = {
    name: 'passives.main',
    description: 'Passive message event listener. Used by Luna for reactions and stuff.',
    body: (instance) => {
        return () => {
            instance.client.on('messageReactionAdd', (reaction, user) => {
                console.log(reaction.message.react('wokethink'));
            });
        }
    }
}