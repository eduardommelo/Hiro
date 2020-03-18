const { Client } = require('discord.js');
const { Base, Constants, Emotes, Emojis, Functions: { Database, Register, Staff } } = require('../util');
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
        this.login(options.token);
        this.emotes = new Emotes(this, Emojis)
    }
    async login(token = this.options.token) {
        await this.register.registerEvents('listeners');
        return super.login(token);
    }
    get token() {
        return this._token;
    }
    get prefix() {
        return this._prefix;
    }
}