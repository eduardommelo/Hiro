const { Command } = require('../util');
const { MessageEmbed } = require('discord.js');
module.exports = class Eval extends Command {
    constructor(client) {
        super(client, {
            command: 'eval',
            aliases: ['e', 'execute', 'evl']
        })
    }
    async run({message, args, argsAlt, prefix, command, userDB, guildDB, t, firstUpperLetter}) {
        if(!this.client.staff.hasSomeRoles(userDB.roles, ['owner', 'subowner', 'operator', 'developer'])) return;
        const code = args.join(' ');
        if(!code) return message.channel.send(t('commands:eval.noCode', { member: message.member }));
        const embed = new MessageEmbed()
            .addField(t('commands:eval.code'), `\`\`\`js\n${code}\`\`\``, false)
            .setThumbnail(this.client.user.displayAvatarURL())
            .setTimestamp(new Date())
            .setFooter(message.author.username, message.author.displayAvatarURL())
        try {
            const result = await eval(code);
            embed.setColor(this.client.config.mainColor);
            embed.addField(t('commands:eval.result'), `\`\`\`js\n${result}\`\`\``, false);
            message.channel.send(message.member, embed);
        } catch(err) {
            embed.setColor(14221312);
            embed.addField(t('commands:eval.error'), `\`\`\`js\n${err}\`\`\``, false);
            message.channel.send(message.member, embed);
        }
    }
}