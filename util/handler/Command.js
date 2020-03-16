module.exports = class Command {
    constructor(client, options = []) {
        this.client = client;
        this.command = options.command;
        this.aliases = !options.aliases ? false : options.aliases;
        this.label = options.label || [];
        this.usage = options.usage || 'Não definido!';
        this.category = options.category || 'Outros';
    }
    run() {
        throw new Error('[Command] Informe a função .run({})');
    }
}