const { Command } = require('../../util');
const { MessageEmbed } = require('discord.js');
module.exports = class Help extends Command {
    constructor(client) {
        super(client, {
            command: 'help',
            aliases: ['commands', 'ajuda', 'comandos', 'cmds', 'h']
        })
        this._opened = [];
    }
    async run({message, argsAlt, prefix, command, t}) {
        const member = message.member;
        if(this._opened.includes(message.author.id)) return message.channel.send(t('commands:help.inWindow', { member }));
        const home = new MessageEmbed()
            .setAuthor(`${this.client.user.username} - ${t('commands:help.title')}`, this.client.user.displayAvatarURL({ format: 'webp' }))
            .setDescription(t('commands:help.mainDescription', { prefix, command }))
            .setThumbnail(this.client.user.displayAvatarURL({ format: 'webp' }))
            .setFooter(message.author.username, message.author.displayAvatarURL({ format: 'webp' }))
            .setColor(this.client.config.mainColor)
            .setTimestamp(new Date());
        let categories = Object.keys(t('help:categories'));
        for(var i = 0; i < categories.length; i++) {
            const cmdsMap = this.client.register.commands.filter(cmd => cmd.category(t) === categories[i]).map(cmd => `\`${cmd.command}\``).join(', ');
            home.addField(`⯈ ${t(`help:categories.${categories[i]}`)}:`, cmdsMap)
        };
        message.channel.send(home);
    }
}