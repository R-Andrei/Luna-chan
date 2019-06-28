const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'Standard help command.',
    args: true,
    min_args: 1,
    usage: '',
    execute: (message, args = []) => {
        return new Promise((resolve, reject) => {

        });
    }
}