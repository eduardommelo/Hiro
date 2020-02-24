const { Client } = require('discord.js');
const Constants = require('../util/Constants');
const Base = require('../util/Base');
const Register = require('../util/functions/Register');
const Database = require('../util/functions/MongoDB');
const fs = require('fs');
module.exports =  class Cody extends Client {
    constructor(options = []) {
        super();
        this.base = new Base(this);
        this._owners = options.owners || [];
        this._token = options.token;
        this._prefix = options.prefix;
        this.register = new Register(this);
        this.database = new Database(this);
        this.constants = Constants;
        fs.readdir(Constants.CODY.listeners, (err, files) => {
            for(var i = 0; i < [...files].length; i++) {
                const file = files[i];
                this.on(file.split(".")[0], require(`../listeners/${file}`).bind(null, this));
            }
        })
        this.login(options.token)
    }
    get owners () {
        return this._owners
    }
    get token() {
        return this._token
    }
    get prefix() {
        return this._prefix
    }
}