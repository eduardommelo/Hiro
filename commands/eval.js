const Command = require('../util/handler/Command')
module.exports = class Ping extends Command {
    constructor(client){
        super(client, {
            command: 'eval',
            aliases: ['e', 'execute'],
            description: 'Execute códigos utilizando o bot.',
        })
    }
    async run({message, args}) {
        if(!this.client.owners.includes(message.author.id)) return;
        if(!args[0]) return;
        const code = args.join('');
        try {
            const res = await eval(code);
            message.channel.send(`EXECUTADO!\n\`\`\`${res}\`\`\``);
        } catch(err) {
            message.channel.send(`ERRO!\n\`\`\`${err}\`\`\``);
        }
    }
}