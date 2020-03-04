const { Collection } = require('discord.js');
const { join } = require('path');
const { readdirSync, lstatSync } = require('fs');
module.exports = class Register {
   constructor(client) {
        this.client = client;
        this.commands = new Collection();
        this.aliases = new Collection();
    }
    registerCommands(commands) {
        for(var i = 0; i < commands.length; i++) {
            if(this.commands.get(commands[i].command)) throw new Error('[Command] Foram encontrados comandos com nomes iguais.');
            if(Array.isArray(commands[i].aliases)) {
                for(var c = 0; c < commands[i].aliases.length; c++) {
                    if(this.aliases.some(c => c === commands || c === commands[i].aliases[c])) return new Error('[Command] O comando' + commands[i].alises[c] + ' já existe na instância collection.');
                }
            } else {
                this.verifyAliases(commands[i].aliases);
            }
            this.commands.set(commands[i].command, commands[i]);
        }
    }
    verifyAliases(commandAliases) {
        this.commands.map(cmd => {
            if(cmd.aliases === commandAliases) throw new Error('[Command] Foi encontrado comandos alternativos duplicados.');

        })
    }
    fileCommands(path) {
        path = join(__dirname, '../', '../', path);
        const doThings = path => readdirSync(path).map(a => lstatSync(path + '/' + a).isDirectory() ? doThings(`${path}/${a}`) : require(`${path}/${a}`));
        const commands = Object.values(doThings(path));
        const getCommands = [];
        for(var i = 0, length = commands.length; i < length; i++) {
            if (typeof commands[i] === 'function') commands[i] = new commands[i](this.client);
            if (Array.isArray(commands[i])) commands[i] = this.subPath(commands[i]);
            getCommands.push(commands[i]);
        }
        this.registerCommands(getCommands);
    }
    subPath(path) {
        if(!Array.isArray(path)) return;
        for(var i = 0, length = path.length; i < length; i++) {
            if(typeof path[i] === 'function') path[i] = new path[i](this.client);
            if(Array.isArray(path[i])) path[i] = this.subPath(path[i]);
            return path[i];
        }
    }
}