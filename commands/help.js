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
    const categories = await this.categories(t, prefix);
    let arrayOfCommands = '';
    for(const key in categories) {
      arrayOfCommands += `\`\`\`ini\n[ ${key} ]`;
      for(const cmd of categories[key]) arrayOfCommands += `\n; ${prefix}${cmd.command}     ::     ${this.isFunction(cmd.usage) ? cmd.usage(t, prefix) : cmd.usage}`;
      arrayOfCommands += '```';
    }
    embed.setDescription(`\n${arrayOfCommands}`);
    message.channel.send(embed.setAuthor('HELP'));

  }
  categories(t, prefix) {
    return this.client.register.commands.reduce((elements, command) => {
      command.category = this.isFunction(command.category) ? command.category(t, prefix) : command.category;
      if (!elements[command.category]) {
        elements[command.category] = [];
      }

      elements[command.category].push(command);
      return elements;
    }, {});
  }
  isFunction(input) {
    return typeof input === 'function';
  }
}
