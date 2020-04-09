const { Client } = require('discord.js');
const { Base, Constants, Functions: { Database, Register, Staff } } = require('../util');
module.exports =  class Cody extends Client {
    constructor(options = {}) {
        super();

        this._owner = options.owner || '';
        this._token = options.token;
        this._prefix = options.prefix;
        this._constants = Constants;

        this.register = new Register(this);
        this.database = new Database(this);
        this.staff = new Staff(this);
        this.base = new Base(this);

        this.login(options.token);
    }
    async login(token = this.options.token) {
        await this.register.registerEvents('listeners');
        return super.login(token);
    }
    get token() { return this._token };
    get prefix() { return this._prefix };
    get constants() { return this._constants };
}