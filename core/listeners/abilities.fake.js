module.exports = {
    name: 'ready.main',
    description: 'Listener for ready login event.',
    body: (instance) => {
        return () => {
            instance.client.on('message', msg => {
                if (msg.author.tag === 'Fake#1000' && msg.channel.id === '588668921075335178') {
                    if (msg.content === '!!terminate') {}
                    if (msg.content.charAt(0) === '!') {
                        let split = msg.content.split(' ');
    
    
                    } else if (fake_listener === 'on') {
                        (msg.content.charAt(0) === '\\') ? send_fake_message(client, msg.content.substring(1)): send_fake_message(client, msg.content);
                    }
                }
            });
        }
    }
}

// if (ability.name == 'kys') instance.storage.close_connection()
//                             .then(result => console.log(result))
//                             .catch(err => console.log(err));