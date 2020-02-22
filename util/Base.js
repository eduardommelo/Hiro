
const {Collection} = require('discord.js')
module.exports = class Base {
    constructor(client){
        this.client = client
        this.cooldown = new Collection()
    }

    emitMessage (msg){
        const message = Array.isArray(msg) ? msg[1] : msg
        if(message.author.bot || message.channel.type === 'dm') return
        if(message.content.indexOf(this.client.prefix) !== 0) return
        const args = message.content.slice(this.client.prefix.length).trim().split(/ +/g)
        const command = (args.shift().toLowerCase() || message.guild.members.get(args[0]))
        console.log(this.client.register.commands)
        console.log(command)

    }


}