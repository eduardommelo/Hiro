const { MessageEmbed } = require('discord.js');
module.exports = class CodyEmbed extends MessageEmbed {
	constructor(...args) {
		super(...args);
		this._color = 5289;
		this.cody = () => this.setColor(this._color);
	};
}