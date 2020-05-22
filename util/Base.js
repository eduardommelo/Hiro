const Emojis = require('./Assets/Emojis.json');
module.exports = class Base {
    constructor(client) {
        this.client = client;
        this.database = this.client.database;

        this._cooldown = {
            commands: new Map()
        }
    }
    async emitMessage(msg) {
        const message = Array.isArray(msg) ? msg[1] : msg;
        if(message.author.bot || message.channel.type === 'dm') return;
        const userDB = await this.database.findOrCreate('Users', {_id: message.author.id});
        const guildDB = await this.database.findOrCreate('Guilds', {_id: message.guild.id});
        const t = (path, values) => this.translate(guildDB.lang, path, values);
        this.emitCommand(message, userDB, guildDB, t);
    }
    emitCommand(message, userDB, guildDB, t) {
        const id = this.client.user.id;
        const prefixes = [guildDB.prefix || this.client.prefix, `<@${id}>`, `<@!${id}>`];
        const prefix = prefixes.find(p => message.content.startsWith(p)) || false;
        if(!prefix || !message.content.startsWith(prefix) || message.content === prefix) return;
        const args = message.content.slice(prefix.length).trim().split(' ');
        const argsAlt = [...args].join(' ').split(/ +/g).slice(1);
        const command = [...args].join(' ').split(/ +/g).shift().toLowerCase();
        args.shift();
        const cmdRun = this.client.register.commands.find(c => c.command === command || c.aliases.includes(command));
        if(cmdRun) {
            const inCooldown = this._cooldown.commands.get(message.author.id);
            const cooldown = Date.now() - inCooldown;
            if(!inCooldown || cooldown >= 3000) {
                this._cooldown.commands.set(message.author.id, Date.now());
                cmdRun.run({message, args, argsAlt, prefix, command, userDB, guildDB, t, firstUpperLetter: this.firstUpperLetter});
            } else {
                const seconds = Math.floor(((inCooldown + 3000) - Date.now())/1000);
                message.channel.send(t('events:message.cmdCooldown.msg', { 
                    member: message.member,
                    time: seconds ? t('events:message.cmdCooldown.seconds', { seconds }) : t('events:message.cmdCooldown.ms')
                }));
            };
        }
    }
    translate(lang = 'ptBR', path, values = {}) {
        if(!path) return false;
        try {
            const file = require(`../locales/${lang}/${path.split(':')[0]}.json`);
            const replacers = Object.keys(values);
            const emojis = Object.keys(Emojis);
            const splited = path.split(':')[1].split('.');
            let getter = file;
            for(var i = 0, length = splited.length; i < length; i++) {
                if(getter[splited[i]]) getter = getter[splited[i]];
                else { return false };
            }
            if((typeof getter) === 'string') {
                for(var i = 0, length = emojis.length; i < length; i++) {
                    getter = getter.split(`<{${emojis[i]}}>`).join(Emojis[emojis[i]]);
                }
                for(var i = 0, length = replacers.length; i < length; i++) {
                    getter = getter.split(`{{${replacers[i]}}}`).join(values[replacers[i]]);
                }
                getter = this.mentionReplace(getter);
            }
            return getter;
        } catch(e) { console.log(e); return false };
    }
    firstUpperLetter (str = 'no string') { return str[0].toUpperCase() + str.slice(1) };
    mentionReplace(str = null) {
        if(!str) return 'no string';
        const id = this.client.user.id;
        const mentions = [`<@${id}>`, `<@!${id}>`];
        if(mentions.some(mention => str.includes(mention))) {
            let text = str;
            for(var i = 0, length = mentions.length; i < length; i++) {
                const mention = mentions[i];
                if(text.includes(mention)) text = text.split(mention).join(`@${this.client.user.username} `);
            }
            return text;
        } else { return str };
    }
}