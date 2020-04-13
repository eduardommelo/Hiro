const { Client } = require('discord.js');
const { Config, Constants, Base, Functions: { Database, Register, Staff } } = require('../util');
module.exports =  class Hiro extends Client {
    constructor(options = {}) {
        super();

        this._config = Config;
        this._token = options.token;
        this._owner = options.owner || '';
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
    async shardsInfo(prop) {
        const results = await this.shard.fetchClientValues(prop);
        return results.reduce((prev, val) => prev + val, 0);
    }
    get token() { return this._token };
    get owner() { return this._owner };
    get config() { return this._config };
    get prefix() { return this._prefix };
    get constants() { return this._constants };
}