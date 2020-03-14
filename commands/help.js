const { Command, Embed } = require('../util');

module.exports = class Help extends Command {
  constructor(client) {
    super(client, {
      command: 'help',
      aliases: ['ajuda', 'comandos'],
      usage: (language, prefix) => language('commands:help.usage', { prefix }),
      category: (language) => language('commands:help.category')
    });
  }
  async run({ message, args, t, prefix }) {
    const embed = new Embed().cody();
    message.channel.send(embed.setAuthor('HELP'));

  }
  // get categories() {
  //   return this.client.register.commands.reduce((elements, command) => {
  //     if (!elements[command.category]) {
  //       elements[command.category] = [];
  //     }

  //     elements[command.category].push(command);
  //     return elements;
  //   }, {});
  // }
}
