const { Client } = require('discord.js');
const { Base, Constants, Functions: { Database, Register, Staff } } = require('../util');
const { readdir } = require('fs');
module.exports =  class Cody extends Client {
    constructor(options = {}) {
        super();
        this.base = new Base(this);
        this._owner = options.owner || '';
        this._token = options.token;
        this._prefix = options.prefix;
        this.register = new Register(this);
        this.database = new Database(this);
        this.staff = new Staff(this);
        this.constants = Constants;
        readdir(Constants.CODY.listeners, (err, files) => {
            for(var i = 0, length = [...files].length; i < length; i++) {
                const file = files[i];
                this.on(file.split(".")[0], require(`../listeners/${file}`).bind(null, this));
            }
        })
        this.login(options.token);
    }
    get owner () {
        return this._owner;
    }
    get token() {
        return this._token;
    }
    get prefix() {
        return this._prefix;
    }
}