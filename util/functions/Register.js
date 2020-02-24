const { Collection } = require('discord.js');
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
        this.commands.map(cmd =>{
            if(cmd.aliases === commandAliases) throw new Error('[Command] Foi encontrado comandos alternativos duplicados.');

        })
    }
    fileCommands(path) {
        const fs = require('fs');
        const doThings = path => fs.readdirSync(path).map(a => fs.lstatSync(path + '/' + a).isDirectory() ? doThings(`${path}/${a}`) : require(`../../${path}/${a}`));
        let commands = Object.values(doThings(path));
        let getCommands = [];
        for(var i = 0; i < commands.length; i++) {
            if(typeof commands[i] === 'function') commands[i] = new commands[i](this.client);
            if(Array.isArray(commands[i])) commands[i] = this.subPath(commands[i]);
            getCommands.push(commands[i]);
        }
        this.registerCommands(getCommands);
    }
    subPath(path) {
        if(!Array.isArray(path)) return;
        for(var i = 0; i < path.length; i++) {
            if(typeof path[i] === 'function') path[i] = new path[i](this.client);
            if(Array.isArray(path[i])) path[i] = this.subPath(path[i]);
            return path[i];
        }
    }
}