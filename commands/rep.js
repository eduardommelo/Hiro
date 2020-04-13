const { Command, Emojis } = require('../util');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('pt-BR');
module.exports = class Rep extends Command {
    constructor(client) {
        super(client, {
            command: 'rep',
            aliases: ['reputação', 'reputacao', 'reps']
        })
    }
    async run({message, argsAlt, prefix, command, userDB, t}) {
        const member = message.member;
        const target = argsAlt[0] ?
            message.mentions.users.first()
            || await this.client.users.fetch(argsAlt[1]).catch(() => {return false})
            : false;
        const remaining = (userDB.rep.last + 86400000) - Date.now();
        if(remaining > 0 || (remaining <= 0 && !target)) return message.channel.send(t(`commands:rep.${remaining > 0 ? 'noAction' : 'timeFinished' }`, {
            member,
            prefix,
            command,
            time: moment.duration.format([moment.duration((userDB.rep.last + 86400000) - Date.now())], 'hh:mm:ss')
        }));
        if(target.id === member.id) return message.channel.send(t('commands:rep.yourself', { member }));
        if(target.bot) return message.channel.send(t('commands:rep.botMention', { member }))
        const targetDB = await this.client.database.findOrCreate('Users', {_id: target.id});
        userDB.rep.last = Date.now()
        userDB.save();
        targetDB.rep.total += 1;
        targetDB.save();
        message.channel.send(t('commands:rep.sucess', { member, target }));
    }
}