const { MessageEmbed } = require('discord.js');
module.exports = class Embed extends MessageEmbed {
	constructor(...args) {
		super(...args);
		this._defaultColor = 5289;
		this.cody = () => this.setColor(this._defaultColor);
	};
}