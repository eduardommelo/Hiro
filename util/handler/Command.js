module.exports = class Command {
    constructor(client, options = []) {
        this.client = client;
        this.command = options.command;
        this.aliases = !options.aliases ? false : options.aliases;
        this.label = options.label || [];
        this.usage = (language, prefix) => language(`help:${options.command}.usage`, { prefix }) || ((lang) => lang('commands:errors.noUsage'));
        this.category = (language) => language(`help:${options.command}.category`) || ((lang) => lang('commands:errors.noCategory'));
        this.description = (language) => language(`help:${options.command}.description`) || ((lang) => lang('commands:errors.noDescription'));
    }
    run() {
        throw new Error('[Command] Informe a função .run({})');
    }
}