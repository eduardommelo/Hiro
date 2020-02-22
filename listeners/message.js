const { Collection } = require('discord.js')
module.exports = (client, message)=>{
   client.base.emitMessage(message)
}