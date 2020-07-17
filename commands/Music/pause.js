const { Command } = require('../../util');
const { MessageEmbed } = require('discord.js')

module.exports = class Pause extends Command {
  constructor(client) {
    super(client, {
      command: 'pause',
      aliases: ['pausar']
    })
  }
    
  async run({ message, t, args, music }) {
    const player = music.players.get(message.guild.id)
    
    if(!player || !player.queue[0]) {
      return message.channel.send(t('commands:play.notPlaying'))
    }

    if(player.paused) {
      return message.channel.send(t('commands:play.isPaused'))
    }

    message.channel.send(t('commands:play.pausedWithSucess'))
    return player.pause(true)
  }
}