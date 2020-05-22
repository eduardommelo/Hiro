const { Command } = require('../../util');
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
            || await this.client.users.fetch(argsAlt[0]).catch(() => {return false})
            : false;
        const remaining = (userDB.rep.get('last') + 86400000) - Date.now();
        if(remaining > 0 || (remaining <= 0 && !target)) return message.channel.send(t(`commands:rep.${remaining > 0 ? 'noAction' : 'timeFinished' }`, {
            member,
            prefix,
            command,
            time: moment.duration.format([moment.duration((userDB.rep.get('last') + 86400000) - Date.now())], 'hh:mm:ss')
        }));
        if(target.id === member.id) return message.channel.send(t('commands:rep.yourself', { member }));
        if(target.bot) return message.channel.send(t('commands:rep.botMention', { member }))
        const targetDB = await this.client.database.findOrCreate('Users', {_id: target.id});
        userDB.rep.set('last', Date.now());
        userDB.save();
        targetDB.rep.set('total', targetDB.rep.get('total') + 1);
        targetDB.save();
        message.channel.send(t('commands:rep.sucess', { member, target: target.username }));
    }
}