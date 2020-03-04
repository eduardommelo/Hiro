const {Collection} = require('discord.js')
module.exports = class Base {
    constructor(client) {
        this.client = client;
        this.cooldown = new Collection();
    }
    async emitMessage(msg) {
        const message = Array.isArray(msg) ? msg[1] : msg;
        const userDB = await this.client.database.findOrCreate('Users', {_id: message.author.id});
        const guildDB = await this.client.database.findOrCreate('Guilds', {_id: message.guild.id});
        const t = (path, values) => { return this.translate(guildDB.lang, path, values) }
        this.emitCommand(message, userDB, guildDB, t);
    }
    emitCommand(message, userDB, guildDB, t) {
        if(message.author.bot || message.channel.type === 'dm') return;
        const prefix = guildDB.prefix || this.client.prefix;
        if(message.content.indexOf(prefix) !== 0) return;
        const args = message.content.split(' ');
        const argsAlt = [...args].join(' ').trim().split(/ +/g).slice(1);
        const command = args.shift().toLowerCase().slice(prefix.length);
        const cmdRun = this.client.register.commands.find(c => c.command === command || c.aliases.includes(command));
        if(cmdRun) {
            cmdRun.run({message, args, argsAlt, prefix, command, userDB, guildDB, t});
        }
    }
    translate(lang = 'ptBR', path = '', values = {}) {
        const file = require(`../locales/${lang}/${path.split(':')[0]}.json`);
        const replacers = Object.keys(values);
        const splited = path.split(':')[1].split('.');
        let getter = file;
        for(var i = 0, length = splited.length; i < length; i++) {
            getter = getter[splited[i]];
        }
        for(var i = 0, length = replacers.length; i < length; i++) {
            getter = getter.split(`{{${replacers[i]}}}`).join(values[replacers[i]])
        }
        return getter;
    }
}