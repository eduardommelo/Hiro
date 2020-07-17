const { Command } = require('../../util');
const { MessageEmbed } = require('discord.js')
const { Functions: { Paginator } } = require('../../util')

module.exports = class Queue extends Command {
  constructor(client) {
    super(client, {
      command: 'queue',
      aliases: ['fila']
    })
  }
    
  async run({ message, t, args, music }) {
    const emojis = ['◀️', '▶️']
    const player = music.players.get(message.guild.id)
    
    if(!player || !player.queue[0]) {
      return message.channel.send(t('commands:play.notPlaying'))
    }
    
    const queue = player.queue

    let paginaInit = 1
    const totalPages = parseInt(queue.length / 25)

    const embedFunction = ({ page }) => {
      const embed = new MessageEmbed()
      
      embed.setTitle('Fila do ' + message.guild.name)
      embed.setDescription(queue.map(e => t('commands:play.queueMap', { musicName: e.info.title, authorTrack: e.info.dj.tag, musicUrl: e.info.uri })).slice((page * 13) - 13, page * 13).join('\n'))
      embed.setFooter(t('commands:play.page', { of: paginaInit, until: totalPages + 1 }))
      embed.setColor(this.client.config.mainColor)

      return embed;
    }

    const msg = await message.channel.send(embedFunction({ page: paginaInit }))
    console.log(paginaInit)

    if(totalPages === 0) return;

    for(const emoji of emojis) {
      await msg.react(emoji)
    }

    const anterior = msg.createReactionCollector((r, u) => r.emoji.name === "◀️" && u.id === message.author.id, { time: 60000 });
    const proxima = msg.createReactionCollector((r, u) => r.emoji.name === "▶️" && u.id === message.author.id, { time: 60000 });
 

    anterior.on('collect', r => {
      if(paginaInit === 1) {
        paginaInit = totalPages + 1;
        msg.edit(embedFunction({ page: paginaInit }))
      } else {
        paginaInit -= 1
        msg.edit(embedFunction({ page: paginaInit }))
      }
    })

    proxima.on('collect', r => {
      if(paginaInit === (totalPages + 1)) {
        console.log(paginaInit)
          paginaInit = 1
          msg.edit(embedFunction({ page: paginaInit }))
      } else {
          paginaInit += 1
          msg.edit(embedFunction({ page: paginaInit }))
      }
    })
  }
}