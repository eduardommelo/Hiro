const { connection } = require('mongoose');
module.exports = class StaffManager {
    constructor(client) {
        this.client = client;
        this.database = client.database;

        this._roles = ['owner', 'subowner', 'operator', 'developer', 'supervisor', 'designer'];
        this._list = new Map();

        connection.on('open', async() => {
            const usersDB = await this.database.Users.find({ 'roles': { $in: this._roles }});
            for(var i = 0, length = usersDB.length; i < length; i++) {
                this.updateCache(usersDB[i]);
            }
        });
    }
    hasSomeRoles(roles, to_have) {
        return to_have.some(role => roles.includes(role));
    }
    updateCache(userDB) {
        const id = userDB._id;
        if(!this.isStaff(userDB)) return this._list.delete(id);
        this._list.set(id, this.highestRole(userDB.roles));
    }
    async addRole(user_id = null, role_name = null) {
        if(!this._roles.includes(role_name.toLowerCase())) return;
        role_name = role_name.toLowerCase();
        const userDB = await this.database.findOrCreate('Users', {_id: user_id});
        if(userDB.roles.includes(role_name)) return;
        userDB.roles.push(role_name);
        userDB.save();
        this.updateCache(userDB);
    }
    async removeRole(user_id = null, role_name = null) {
        if(!this._roles.includes(role_name.toLowerCase())) return;
        role_name = role_name.toLowerCase();
        const userDB = await this.database.findOrCreate('Users', {_id: user_id});
        if(!userDB.roles.includes(role_name)) return;
        userDB.roles.splice(userDB.roles.indexOf(role_name), 1);
        userDB.save();
        this.updateCache(userDB);
    }
    highestRole(roles) {
        if(!roles) return null;
        let high = '';
        for(var i = 0, length = this._roles.length, stoped = false; i < length && !stoped; i++) {
            const role = this._roles[i];
            if(roles.includes(role)) {
                high = role;
                stoped = true;
            }
        }
        return high;
    }
    async isStaff(userDB = null, user_id = null) {
        if(user_id) userDB = await this.database.findOrCreate('Users', {_id: user_id});
        return userDB.roles.some(role => this._roles.includes(role));
    }
    isHigher(role, to_compare = 'designer') {
        const rolePosition = this._roles.indexOf(role) * (-1);
        const comparePosition = this._roles.indexOf(to_compare) * (-1);
        return rolePosition > comparePosition;
    }
    get roles() { return this._roles };
    get list() { return this._list };
}