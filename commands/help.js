const { Command, Embed } = require('../util');

module.exports = class Help extends Command {
  constructor(client) {
    super(client, {
      command: 'help',
      aliases: ['ajuda', 'comandos']
    });
  }
  async run({ message, args, guildDB, t }) {
    const prefix = guildDB.prefix || process.env.PREFIX;
    const embed = new Embed()
      .setAuthor(t('commands:help.title'), this.client.user.avatarURL({ format: 'png', size: 2048 }))
      .setColor(message.guild.me.displayColor || embed._defaultColor)
      .setFooter(t('commands:help.footer'));
    const categories = await this.categories(t, prefix);
    let arrayOfCommands = '';

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
      arrayOfCommands += '\n```\n';
    }
    embed.setDescription(`\n${t('commands:help.description', { cmd: t('help:help.usage', { prefix }) })}\n\n${arrayOfCommands}\n`);
    message.send(embed);
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