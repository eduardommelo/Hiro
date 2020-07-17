const { Command } = require('../../util');
const { MessageEmbed } = require('discord.js')

module.exports = class Volume extends Command {
  constructor(client) {
    super(client, {
      command: 'volume',
      aliases: ['vol']
    })
  }
    
  async run({ message, t, args }) {
    const player = this.client.music.players.get(message.guild.id)
    const volumeCount = Number(args[0])

    if(!player || player.queue[0]) {
      return message.channel.send(t('commands:play.notPlaying'))
    }

    if(isNaN(volumeCount)) {
      return message.channel.send(t('commands:play.volumeType'))
    }

    message.channel.send(t('commands:play.volume', { volume: volumeCount }))
    return player.volume(volumeCount)
  }
}