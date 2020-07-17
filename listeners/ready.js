const { GorilinkManager } = require('gorilink');
const { MessageEmbed } = require('discord.js');

module.exports = async (client) => {
   console.log(`[DiscordBot] ${client.user.tag} iniciado com sucesso.`);
    
  client.user.setPresence({ activity: { name: `with ZeroTwo | ${await client.shardsInfo('guilds.cache.size')} servers.` }, status: 'online'});
  setInterval(async () => {
    client.user.setPresence({ activity: { name: `with ZeroTwo | ${await client.shardsInfo('guilds.cache.size')} servers.` }, status: 'online'});
  }, (5 * 60) * 1000);

  client.music = new GorilinkManager(client, client.nodes)
    .on('nodeConnect', async (node) => {
      console.log(`${node.tag} conectado com sucesso!`)
    })
    .on('nodeError', (error) => console.log(error))
    .on('trackStart', async ({ player, track }) => {
      const embed = new MessageEmbed()
        .setDescription(player.t('commands:play.playing', { musicName: track.info.title, author: track.info.dj.tag }))
        .setColor(client.config.mainColor)

      player.textChannel.send(embed);
    })

  client.register.fileCommands('./commands');
}