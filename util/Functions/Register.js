const { Collection } = require('discord.js');
const { readdirSync, lstatSync } = require('fs');
const { join } = require('path');
module.exports = class Register {
    constructor(client){
        this.client = client;

        this.commands = new Collection();  
        this.aliases = new Collection();
        this.results = [];
    }
    registerCommands(commands) {
        for(let i = 0, length = commands.length; i < length; i++) {
            if(this.commands.get(commands[i].command)) throw new Error('[Register:CMDS] Foram encontrados comandos com nomes iguais.');
            if(Array.isArray(commands[i].aliases)) {
                for(let c = 0, aliLength = commands[i].aliases.length; c < aliLength; c++) {
                    if(this.aliases.some(c => c === commands || c === commands[i].aliases[c])) return new Error(`[Register:CMDS] O comando ${commands[i].alises[c]} já existe na instância collection.`);
                }
            } else {
                this.verifyAliases(commands[i].aliases);
            }

            this.commands.set(commands[i].command, commands[i]);
        }
    }
    verifyAliases(commandAliases) {
        this.commands.map(cmd => {
            if(cmd.aliases === commandAliases) throw new Error('[Register:CMDS] Foram encontrados comandos alternativos duplicados.');
        })
    }
    fileCommands(path) {
        path = join(__dirname, '../', '../', path);
        const getCollections = [];
        for(var values of this.requireAll(path)) {
            if(Array.isArray(values)) {
                for(var filters of this.filterDirectory(values)) {
                    if(typeof filters === 'function') filters = new filters(this.client);
                    if(!getCollections.find(c => c.command === filters.command)) {
                        getCollections.push(filters);
                    }
                }
            }
            if(!Array.isArray(values)) {
                if(typeof values === 'function') values = new values(this.client);
                getCollections.push(values);
            }
        }

        return this.registerCommands(getCollections);
    }
    filterDirectory(dir) {
        for(var values of dir) {
            if(Array.isArray(values)) {
                this.filterDirectory(values);
            } else {
                this.results.push(values);
            }
        }
        return this.results;
    }
    requireAll(dir) {
        const requireAll = path => readdirSync(path).map(a => lstatSync(path + '/' + a).isDirectory() ? 
        requireAll(`${path}/${a}`) : require(`${path}/${a}`));
        return requireAll(dir);
    }
    async registerEvents(path) {
        path = join(__dirname, '../', '../', path);
        const files = await readdirSync(path);
        for(var i = 0, length = [...files].length; i < length; i++) {
            const file = files[i];
            this.client.on(file.split(".")[0], require(join(path, file)).bind(null, this.client));
        }
    }
}