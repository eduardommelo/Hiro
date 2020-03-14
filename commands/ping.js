const { Command, Embed } = require('../util');
const { MessageEmbed } = require('discord.js');
module.exports = class Ping extends Command {
  constructor(client) {
    super(client, {
      command: 'ping',
      aliases: ['p', 'latency'],
      usage: (language, prefix) => language('commands:ping.usage', { prefix })
    })
  }
  async run({ message, args }) {
    const embed = new Embed().cody();
    const number = isNaN(args[0]) ? message.guild.shard.id : (parseInt(args[0]) -1);
    const shards = await this.client.shard.broadcastEval('this.ws');
    const shardSelected = shards[number];

    if (!shardSelected) return message.channel.send(embed.setDescription('Essa shard não existe.'));

    const { shards: [shard] } = shardSelected;

    const m = await message.channel.send(embed.setDescription('Procurando informações, aguarde.'));

    await m.edit(embed.setTitle(`Shard[${shard.id + 1}/${shards.length}]`).setDescription(`📡 Latência da API: **${~~shard.ping}ms**\n📨 Tempo de resposta: **${m.createdAt - message.createdAt}ms**`));
  }
}