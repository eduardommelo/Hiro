const { Command, Embed } = require('../util');
const { MessageEmbed } = require('discord.js');
module.exports = class Ping extends Command {
  constructor(client) {
    super(client, {
      command: 'ping',
      aliases: ['p', 'latency']
    })
  }
  async run({ message, args }) {
    const embed = new Embed().cody();
    const shards = this.client.ws.shards;
    const shardSelected = Number.isNaN(Number.parseInt(args[0])) ? 0 : Number.parseInt(args[0]) || 0;
    if (shardSelected > shards.size) return message.channel.send(embed.setDescription('não existe.'));
    const shard = shards.array()[shardSelected];

    return message.channel.send(embed.setDescription('teste'));
  }
}