module.exports = class Command {
    constructor(client, options = []) {
        this.client = client;
        this.command = options.command;
        this.aliases = !options.aliases ? false : options.aliases;
        this.label = options.label || [];
        this.usages = (language, prefix = this.client.prefix) => language(`help:${options.command}.usages`).map(use => `${this.client.base.mentionReplace(prefix)}${use}`) || [language('help:errors.noUsages')];
        this.category = (language) => language(`help:${options.command}.category`) || language('help:errors.noCategory');
        this.description = (language) => language(`help:${options.command}.description`) || language('help:errors.noDescription');
    }
    run() {
        throw new Error('[Command] Informe a função .run({})');
    }
}