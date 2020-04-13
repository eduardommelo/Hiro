const { Command, Emojis } = require('../util');
const { MessageEmbed } = require('discord.js');
module.exports = class Avatar extends Command {
    constructor(client) {
        super(client, {
            command: 'avatar',
            aliases: ['av']
        })
    }
    async run({message, argsAlt, t}) {
        const member = message.member;
        const target = argsAlt[0] ?
            message.mentions.users.first()
            || message.guild.members.cache.find(user => user.displayName.toLowerCase() === argsAlt.join(' ').toLowerCase()).user
            || this.client.users.cache.find(user => user.username.toLowerCase() === argsAlt.join(' ').toLowerCase() || user.tag.toLowerCase() === argsAlt.join(' ').toLowerCase())
            || await this.client.users.cache.fetch(argsAlt[1]).catch(() => {return false})
            : message.author;
        const 
    }
}