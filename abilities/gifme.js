const rp = require('request-promise');
const cheerio = require('cheerio');


module.exports = {
    name: 'gif',
    description: 'Sends poor quality jifs.',
    args: true,
    min_args: 1,
    usage: '<tag> <tag>...',
    execute: (instance, message, args) => {
        const base_url = 'https://tenor.com';
        const options = { uri: `https://tenor.com/search/${args.join('-')}-gifs`, transform: (body) => { return cheerio.load(body); } }
        rp(options).then(data => {
            const random = Math.floor(Math.random() * Math.floor(data('.GifListItem').length - 1));
            let giflist = [];
            data('.GifList div .GifListItem').each((_index, element) => {
                const url = data(element).find('a').attr('href');
                (url.startsWith('/view')) ? giflist.push(url): {};
            });
            instance.client.channels.get(message.channel.id).send(`${base_url}${giflist[random]}`);
        }).catch(_err => {
            message.reply(`Something didnt work out. :cry: ${_err}`);
        });
    }
}