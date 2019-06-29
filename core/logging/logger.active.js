const { prefix } = require('../prefixes.json');
const moment = require('moment');


module.exports = class Logger {
    constructor () {
        this.actions = {
            ability: {
                activity: "casting",
                subject: "ability"
            },
            transaction: {
                activity: "storing",
                subject: "cast"
            }
        }
    }

    log_ability_error (message, ability, action, error) {
        console.log([
            `\n${moment(new Date(message.createdTimestamp)).format('YYYY-MM-DD, h:mm:ss a')}:`,
            `Error ${this.actions[action].activity} ${this.actions[action].subject}`,
            `${prefix}${ability.name} for user: ${message.author.tag} on channel '${message.channel.name}'`,
            `${(message.guild) ? 'of guild ' + "'" + message.guild.name + "'\n" : '\n' }`,
            `Error info: ${error}`
        ].join(' '));
    }

    log_ability_success (result, message, ability) {
        console.log([
            `\n${moment(new Date(message.createdTimestamp)).format('YYYY-MM-DD, h:mm:ss a')}:`,
            `Succesfully casted ability ${prefix}${ability.name} for user ${message.author.tag}.`,
            `Result on channel '${result.channel.name}' ${(message.guild) ? 'of guild ' + "'" + message.guild.name + "'" : '\n' }`
        ].join(' '));
    }
}