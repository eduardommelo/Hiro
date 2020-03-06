const Command = require('../util/handler/Command');
module.exports = class Ping extends Command {
    constructor(client) {
        super(client, {
            command: 'ping',
            aliases: ['p', 'latency']
        })
    }
    async run({ message, args }) {
        message.channel.send('teste');
    }
}