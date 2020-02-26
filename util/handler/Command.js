module.exports = class Command {
    constructor(client, options = []) {
        this.client = client;
        this.command = options.command;
        this.aliases = !options.aliases ? false : options.aliases;
        this.description = options.description;
        this.label = options.label || [];
        this.hasPermission = !options.hasPermission ? false : options.hasPermission;
        this.mePermission = !options.mePermission ? false : options.mePermission;
        this.isOwner = !options.isOwner ? false : options.isOwner;
    }
    async run({message, args, userDB, guildDB}) {
        throw new Error('[Command] Informe a função .run({})');
    }
}