const Command = require('../util/handler/Command')
module.exports = class Eval extends Command {
    constructor(client) {
        super(client, {
            command: 'eval',
            aliases: ['e', 'execute']
        })
    }
    async run({message, args, argsAlt, userDB, guildDB, t}) {
        if(!this.client.owners.includes(message.author.id)) return;
        if(!args[0]) return;
        const code = args.join(' ');
        try {
            const res = await eval(code);
            message.channel.send(`EXECUTADO!\n\`\`\`${res}\`\`\``);
        } catch(err) {
            message.channel.send(`ERRO!\n\`\`\`${err}\`\`\``);
        }
    }
}