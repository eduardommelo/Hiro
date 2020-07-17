const { Command } = require('../../util');
const { MessageEmbed } = require('discord.js');
module.exports = class Ping extends Command {
    constructor(client) {
        super(client, {
            command: 'ping',
            aliases: []
        })
    }
    async run({message, argsAlt, prefix, command, userDB, t}) {
        message.channel.send('isso é temporario pq o animal do marcio nao fez\n\nLatência: **' + Math.round(this.client.ws.ping) + '**')
    }
}