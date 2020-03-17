const { Command, Embed } = require('../util');

module.exports = class Help extends Command {
  constructor(client) {
    super(client, {
      command: 'help',
      aliases: ['ajuda', 'comandos'],
      usage: (language, prefix) => language('commands:help.usage', { prefix }),
      category: (language) => language('commands:help.category'),
      description: (language) => language('commands:help.description')
    });
  }
  async run({ message, args, t, prefix }) {
    const embed = new Embed().cody();
    const categories = await this.categories(t, prefix);
    let arrayOfCommands = '';

    // Gambiarra para fazer os espaços bonitinhos na embed.

    let length = 0;
    let before = 3;

    for (const key in categories) {
      for (const cmd of categories[key]) {
        if (cmd.command.length > length) {
          length = cmd.command.length;
        }
      }
    }

    for(const key in categories) {
      arrayOfCommands += `\`\`\`ini\n[ ${key} ]`;
      for(const cmd of categories[key]) {
        const spaces = [...new Array((length - cmd.command.length) + before)]
        .map(() => ' ')
        .join('');
        arrayOfCommands += `\n; ${prefix}${cmd.command} ${spaces} ::   ${this.isFunction(cmd.description) ? cmd.description(t, prefix) : cmd.description}`;
      }
      arrayOfCommands += '```';
    }
    embed.setDescription(`\n${arrayOfCommands}`);
    message.send(embed.setAuthor('HELP'));

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
