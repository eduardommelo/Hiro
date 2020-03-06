require('dotenv').config();

const { ShardingManager } = require('discord.js');
const manager = new ShardingManager(`./client/index.js`, { totalShards: 1 });

manager.on('launch', shard => console.log(`Shard ${shard.id + 1}: iniciada com sucesso!`));

manager.spawn();