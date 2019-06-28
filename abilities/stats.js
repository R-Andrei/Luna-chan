const Discord = require('discord.js');
const moment = require('moment');


module.exports = {
    name: 'stats',
    description: 'Shows stats for users',
    args: true,
    min_args: 1,
    usage: '@user_mention, or just !stats',
    execute: (instance, message, args = []) => {
        if (args.length) const target = args[0].replace(/[\<\@\!\>]+/, '')
        const member = (args.length) ? message.guild.members.find(user => user.id == target) : message.guild.members.find(user => user.id === message.author.id);
        const embed = new Discord.RichEmbed()
            .setColor(`${member.displayHexColor}`)
            .setTitle(`${member.user.tag}`)
            .setAuthor(`${(member.nickname) ? member.nickname.length : member.user.username}'s stats`, `${member.user.avatarURL}`)
            .setDescription('Looks like this user is a complete degenerate... \\*sigh\\*')
            .setThumbnail(`${member.user.avatarURL}`)
            .addBlankField()
            .addField('Joined this junkyard at:', `${moment(new Date(member.joinedTimestamp)).format('MMM Do YYYY')}`, true)
            .addField('Managed to get this far:', `${(member.highestRole.name == '@everyone') ? 'pretty much nowhere..' : member.highestRole}`, true)
            .addBlankField()
            .addField('Crappy messages sent:', `coming soon`, true)
            .addField('Experience gained:', `coming soon`, true)
            .addBlankField()
            .setFooter('put together by awesome me', `${instance.client.user.avatarURL}`)
        return message.reply(embed);
    }
}