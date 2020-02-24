const {Collection} = require('discord.js')
module.exports = class Base {
    constructor(client) {
        this.client = client;
        this.cooldown = new Collection();
    }
    emitMessage(msg) {
        const message = Array.isArray(msg) ? msg[1] : msg;
        if(message.author.bot || message.channel.type === 'dm') return;
        if(message.content.indexOf(this.client.prefix) !== 0) return;
        const args = message.content.slice(this.client.prefix.length).trim().split(/ +/g);
        const command = (args.shift().toLowerCase() || message.guild.members.get(args[0]));
        let cmdRun = this.client.register.commands.find(c => c.command === command || c.aliases.includes(command));
        if(cmdRun) {
            cmdRun.run({message, args});
        }
    }
}