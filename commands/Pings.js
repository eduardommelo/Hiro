const Command = require('../util/handler/Command')
module.exports = class Ping extends Command{
    constructor(client){
        super(client, {
            command: 'pings',
            aliases: 'ps',
            description: 'Latência entre a api e a aplicação.',

        })
    }

    async run(client, message, args){
        
    }
}