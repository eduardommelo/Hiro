const { Command } = require('../../util');
const { MessageEmbed } = require('discord.js')

module.exports = class Resume extends Command {
  constructor(client) {
    super(client, {
      command: 'resume',
      aliases: ['despausar']
    })
  }
    
  async run({ message, t, args, music }) {
    const player = music.players.get(message.guild.id)

    if(!player || !player.queue[0]) {
      return message.channel.send(t('commands:play.notPlaying'))
    }

    if(!player.paused) {
      return message.channel.send(t('commands:play.paused'))
    }

    message.channel.send(t('commands:play.resumedMusic'))
    return player.pause(false)
  }
}