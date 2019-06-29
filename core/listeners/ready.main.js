module.exports = {
    name: 'ready.main',
    description: 'Listener for ready login event.',
    body: (instance) => {
        return () => {
            instance.client.on('ready', () => {
                console.log(`Logged in as ${instance.client.user.tag}!`);
                instance.client.user.setActivity('with your feelings');
            });
        }
    }
}