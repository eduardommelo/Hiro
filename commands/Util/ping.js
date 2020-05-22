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
        message.channel.send('oi')
    }
}