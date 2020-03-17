module.exports = class Command {
    constructor(client, options = []) {
        this.client = client;
        this.command = options.command;
        this.aliases = !options.aliases ? false : options.aliases;
        this.label = options.label || [];
        this.usage = options.usage || ((lang) => lang('commands:errors.noUsage'));
        this.category = options.category || ((lang) => lang('commands:errors.noCategory'))
        this.description = options.description || ((lang) => lang('commands:errors.noDescription'));
    }
    run() {
        throw new Error('[Command] Informe a função .run({})');
    }
}