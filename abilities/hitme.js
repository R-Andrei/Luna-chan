const rp = require('request-promise');
const cheerio = require('cheerio');


module.exports = {
    name: 'hitme',
    description: 'Basically a shitpost in joke format.',
    args: false,
    min_args: 0,
    usage: '',
    execute: (instance, message) => {
        const options = { uri: 'https://www.goodbadjokes.com/', transform: (body) => { return cheerio.load(body); } }
        rp(options).then(data => {
            let jokelist = []
            const random = Math.floor(Math.random() * 6);
            data('.post .joke-body-wrap a').each((_index, element) => {
                (data(element).find('dt').text().replace(/\s+/g, ' ').length > 1) ? jokelist.push({ setup: data(element).find('dt').text().replace(/\s+/g, ' '), punchline: data(element).find('dd').text().replace(/\s+/g, ' ') }): {};
            });
            instance.client.channels.get(message.channel.id).send(jokelist[random].setup)
                .then(sent => {
                    console.log(`Sent message to channel ${sent.channel.name}`);
                    instance.client.channels.get(message.channel.id).send(jokelist[random].punchline)
                        .then(sent => {
                            console.log(`Sent message to channel ${sent.channel.name}`);
                            return 0;
                        });
                });
        }).catch(err => { console.log(err); return -1; });
    }
}