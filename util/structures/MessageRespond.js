const { Structures, APIMessage } = require('discord.js');

Structures.extend('Message', _Message => {
  	class Message extends _Message {
		constructor(...args) {
			super(...args);
			this._responses = [];
		}
		get responses() {
			return this._responses.filter(msg => !msg.deleted);
		}
		async send(content, options) {
			const combinedOptions = APIMessage.transformOptions(content, options);

			if ('files' in combinedOptions) return this.channel.send(combinedOptions);
			const newMessages = new APIMessage(this.channel, combinedOptions).resolveData().split().map(mes => {
				mes.data.embed = mes.data.embed || null;
				mes.data.content = mes.data.content || null;
				return mes;
			});

			const { responses } = this;
			const promises = [];
			const max = Math.max(newMessages.length, responses.length);

			for (let i = 0; i < max; i++) {
				if (i >= newMessages.length) responses[i].delete();
				else if (responses.length > i) promises.push(responses[i].edit(newMessages[i]));
				else promises.push(this.channel.send(newMessages[i]));
			}

			const newResponses = await Promise.all(promises);
			this._responses = newMessages.map((val, i) => responses[i] || newResponses[i]);

			return newResponses.length === 1 ? newResponses[0] : newResponses;
		}
	}
  	return Message;
});

// Créditos ao notsapinho!