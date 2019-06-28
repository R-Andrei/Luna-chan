const rp = require('request-promise');
const cheerio = require('cheerio');


module.exports = {
    name: 'hitme',
    description: 'Basically a shitpost in joke format.',
    args: false,
    min_args: 0,
    usage: '',
    execute: (message, args) => {
        return new Promise((resolve, reject) => {
            if (args != []) message.reply(`What'd you give me those for? '${args.join(', ')}'`).catch(err => console.log(err));
            const options = { uri: 'https://www.goodbadjokes.com/', transform: (body) => { return cheerio.load(body); } }
            rp(options).then(data => {
                let jokelist = []
                const random = Math.floor(Math.random() * 6);
                data('.post .joke-body-wrap a').each((_index, element) => {
                    (data(element).find('dt').text().replace(/\s+/g, ' ').length > 1) ? jokelist.push({ setup: data(element).find('dt').text().replace(/\s+/g, ' '), punchline: data(element).find('dd').text().replace(/\s+/g, ' ') }): {};
                });
                message.client.channels.get(message.channel.id).send(jokelist[random].setup)
                    .then(sent => {
                        console.log(`Sent message to channel ${sent.channel.name}`);
                        message.client.channels.get(message.channel.id).send(jokelist[random].punchline)
                            .then(sent => {
                                console.log(`Sent message to channel ${sent.channel.name}`);
                                resolve(sent);
                            });
                    });
            }).catch(err => reject(err));
        });

    }
}