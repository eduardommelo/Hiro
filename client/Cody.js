const { Client } = require('discord.js');
const { Base, Constants, Functions: { Database, Register, Staff } } = require('../util');
const { readdir } = require('fs');
module.exports =  class Cody extends Client {
    constructor(options = []) {
        super();
        this.base = new Base(this);
        this._owners = options.owners || [];
        this._token = options.token;
        this._prefix = options.prefix;
        this.register = new Register(this);
        this.database = new Database(this);
        this.staff = new Staff(this);
        this.constants = Constants;
        readdir(Constants.CODY.listeners, (err, files) => {
            for(var i = 0; i < [...files].length; i++) {
                const file = files[i];
                this.on(file.split(".")[0], require(`../listeners/${file}`).bind(null, this));
            }
        })
        this.login(options.token);
    }
    get owners () {
        return this._owners;
    }
    get token() {
        return this._token;
    }
    get prefix() {
        return this._prefix;
    }
}