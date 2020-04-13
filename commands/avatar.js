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
        let target = argsAlt[0] ?
            message.mentions.users.first()
            || this.client.users.cache.find(user => user.username.toLowerCase() === argsAlt.join(' ').toLowerCase() || user.tag.toLowerCase() === argsAlt.join(' ').toLowerCase())
            || message.guild.members.cache.find(user => user.displayName.toLowerCase().includes(argsAlt.join(' ').toLowerCase()))
            || await this.client.users.fetch(argsAlt[0]).catch(() => {return false})
            || message.author
            : message.author;
        if(target.user) target = target.user;
        const embed = new MessageEmbed()
            .addField(t('commands:avatar.title', { target: target.tag }), t('commands:avatar.download', { link: target.displayAvatarURL({ format: 'png' }) }))
            .setImage(target.displayAvatarURL({ format: 'png', size: 1024 }))
            .setFooter(message.author.username, message.author.displayAvatarURL())
            .setColor(this.client.config.mainColor)
            .setTimestamp(new Date());
        message.channel.send(member, embed);
    }
}