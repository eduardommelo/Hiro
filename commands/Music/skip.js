const { Command } = require('../../util');
const { MessageEmbed } = require('discord.js')

module.exports = class Skip extends Command {
  constructor(client) {
    super(client, {
      command: 'skip',
      aliases: ['pular']
    })
  }
    
  async run({ message, t, args, music }) {
    const membersFiltered = message.member.voice.channel.members.filter(x => !x.user.bot).size
    const player = music.players.get(message.guild.id)

    if(!player || !player.queue[0]) {
      return message.channel.send(t('commands:play.notPlaying'))
    }

    if(!player.queue[0].arrSkip) player.queue[0].arrSkip = []

    if(player.queue[0].arrSkip.includes(message.member.id)) {
      return message.channel.send(t('commands:play.addedVote'))
    }

    player.queue[0].arrSkip.push(message.member.id)

    if(player.queue[0].arrSkip.length >= membersFiltered) {
      player.stop()
      return message.channel.send(t('commands:play.finaleVote'))
    }

    return message.channel.send(t('commands:play.addVote', { of: player.queue[0].arrSkip.length, all: membersFiltered }))
  }
}