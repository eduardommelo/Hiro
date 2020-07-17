const { Command } = require('../../util');
const { MessageEmbed } = require('discord.js')

module.exports = class Play extends Command {
  constructor(client) {
    super(client, {
      command: 'play',
      aliases: ['tocar']
    })
  }

  async run({ message, t, args, music }) {
    if(!message.member.voice.channel) {
      return message.channel.send(t('commands:play.notChannel', { member: message.member }));
    }

    if(!args.join(' ')) {
      return message.channel.send(t('commands:play.noArgs', { member: message.member }))
    }

    const player = await music.join({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel
    })

    const { tracks, loadType, playlistInfo } = await music.fetchTracks(args.join(' '));

    if (loadType === 'TRACK_LOADED' || loadType === 'SEARCH_RESULT') {
      tracks[0].info.dj = message.author;
      player.t = t

      player.queue.add(tracks[0])
      message.channel.send(new MessageEmbed().setDescription(t('commands:play.queue', { music: tracks[0].info.title })).setColor(this.client.config.mainColor))

      if(!player.playing) return player.play();
    } else if(loadType === 'PLAYLIST_LOADED') {

        for (const musics of tracks) {
          player.queue.add(musics);
          musics.info.dj = message.author;
        }

        player.t = t;
        
        if(!player.playing) return player.play();
    }
  }
}