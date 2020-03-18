const { Command, Embed } = require('../util');
module.exports = class Ping extends Command {
	constructor(client) {
		super(client, {
			command: 'ping',
			aliases: ['p', 'latency']
		})
  	}
	async run({ message, argsAlt, t }) {
		const embed = new Embed().cody();
		const number = isNaN(argsAlt[0]) ? message.guild.shard.id : (parseInt(argsAlt[0]) - 1);
		const shards = await this.client.shard.broadcastEval('this.ws');
		const shardSelected = shards[number];
		if(!shardSelected) return message.send(t('commands:ping.invalidShard', {
			member: message.member
		}));
		const { shards: [shard] } = shardSelected;

		message.send(embed.setTitle(`Shard[${shard.id + 1}/${shards.length}]:`).setDescription(t('commands:ping.result', {
			shardPing: ~~shard.ping,
			responseTime: Date.now() - message.createdAt
		})));
	}
}