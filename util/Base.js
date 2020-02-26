const {Collection} = require('discord.js')
module.exports = class Base {
    constructor(client, userDB, guildDB) {
        this.client = client;
        this.cooldown = new Collection();
    }
    async emitMessage(msg) {
        const message = Array.isArray(msg) ? msg[1] : msg;
        const userDB = await this.client.database.findOrCreate('Users', {_id: message.author.id});
        const guildDB = await this.client.database.findOrCreate('Guilds', {_id: message.guild.id});
        this.emitCommand(message, userDB, guildDB);
    }
    async emitCommand(message, userDB, guildDB) {
        if(message.author.bot || message.channel.type === 'dm') return;
        const prefix = guildDB.prefix || this.client.prefix;
        if(message.content.indexOf(prefix) !== 0) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = (args.shift().toLowerCase() || message.guild.members.get(args[0]));
        const cmdRun = this.client.register.commands.find(c => c.command === command || c.aliases.includes(command));
        if(cmdRun) {
            cmdRun.run({message, args, userDB, guildDB});
        }
    }
}