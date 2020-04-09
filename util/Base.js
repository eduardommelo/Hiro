const { Collection } = require('discord.js');
const Emojis = require('./Assets/Emojis.json');
module.exports = class Base {
    constructor(client) {
        this.client = client;
        this.database = this.client.database;
        this.cooldown = new Collection();
    }
    async emitMessage(msg) {
        const message = Array.isArray(msg) ? msg[1] : msg;
        if(message.author.bot || message.channel.type === 'dm') return;
        const userDB = await this.database.findOrCreate('Users', {_id: message.author.id});
        const guildDB = await this.database.findOrCreate('Guilds', {_id: message.guild.id});
        const t = (path, values) => { return this.translate(guildDB.lang, path, values) }
        this.emitCommand(message, userDB, guildDB, t);
    }
    emitCommand(message, userDB, guildDB, t) {
        const id = this.client.user.id;
        const prefixes = [guildDB.prefix || this.client.prefix, `<@${id}>`, `<@!${id}>`];
        const prefix = prefixes.find(p => message.content.startsWith(p)) || '';
        if(!message.content.startsWith(prefix) || message.content === prefix) return;
        const args = message.content.slice(prefix.length).trim().split(' ');
        const argsAlt = [...args].join(' ').split(/ +/g).slice(1);
        const command = [...args].join(' ').split(/ +/g).shift().toLowerCase();
        args.shift();
        const cmdRun = this.client.register.commands.find(c => c.command === command || c.aliases.includes(command));
        if(cmdRun) {
            cmdRun.run({message, args, argsAlt, prefix, command, userDB, guildDB, t});
        }
    }
    translate(lang = 'ptBR', path = '', values = {}) {
        try {
            const file = require(`../locales/${lang}/${path.split(':')[0]}.json`);
            const replacers = Object.keys(values);
            const emojis = Object.keys(Emojis);
            const splited = path.split(':')[1].split('.');
            let getter = file;
            for(var i = 0, length = splited.length; i < length; i++) {
                if(getter[splited[i]]) getter = getter[splited[i]];
                else { return false; };
            }
            for(var i = 0, length = emojis.length; i < length && ((typeof getter) === 'string'); i++) {
                getter = getter.split(`<{${emojis[i]}}>`).join(Emojis[emojis[i]])
            }
            for(var i = 0, length = replacers.length; i < length && ((typeof getter) === 'string'); i++) {
                getter = getter.split(`{{${replacers[i]}}}`).join(values[replacers[i]])
            }
            return getter;
        } catch(e) { return false; };
    }
}