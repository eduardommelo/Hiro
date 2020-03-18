const { Command } = require('../util');
const util = require('util');
module.exports = class Eval extends Command {
    constructor(client) {
        super(client, {
            command: 'eval',
            aliases: ['e', 'execute']
        })
    }
    async run({ message, args, argsAlt, userDB, guildDB, t, prefix }) {
        if(!this.client.staff.hasSomeRoles(userDB.roles, ['owner', 'subowner', 'operator', 'developer'])) return;
        let insert = args.join(' ').replace('--silent', '').replace('--async', '');
        try {
            if (args.join(' ').includes('--async')) insert = `(async () => {\n${insert}\n})();`;
            const evaled = await eval(insert.replace(/(^`{3}(\w+)?|`{3}$)/g, ''));
            const type = typeof evaled;
            const cleanEvaled = this.clean(util.inspect(evaled, { depth: 0 }));
            if (args.includes('--silent')) return null;
            if (cleanEvaled.length > 1800) {
                return message.send({ files: [{ attachment: Buffer.from(cleanEvaled), name: 'output.txt' }], content: 'O resultado ficou muito grande, enviando em um ficheiro.' });
            };
            await message.send(`** 📤 Output**\n` + '```js\n' + cleanEvaled + '\n```' + `**Tipo: \`\`\`js\n${type}\`\`\`**`);
        } catch (err) {
            await message.send('** 📤 Error**\n' + '```prolog\n' + err + '\n```');
        }
    };

    clean(text) {
        if (typeof text === 'string') { return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`).replace(/'/g, `${String.fromCharCode(8203)}`).replace(this.client.token, 'redacted').replace(process.env.MONGODB, 'redacted'); } else { return text; }
    }
}