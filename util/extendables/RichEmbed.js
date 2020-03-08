const { MessageEmbed } = require('discord.js');

class CodyEmbed extends MessageEmbed {
  constructor(...args) {
    super(...args);
    this._color = 5289;
    this.cody = () => this.setColor(this._color);
  };
}

module.exports = CodyEmbed;