const { Command } = require('../util');
const { MessageEmbed } = require('discord.js');
module.exports = class Staff extends Command {
    constructor(client) {
        super(client, {
            command: 'staffrole',
            aliases: ['staffroles', 'stfrole', 'stfroles'],
            usage: (language, prefix) => language('commands:staffrole.usage', { prefix }),
            category: (language) => language('commands:staffrole.category')
        })
        this._allowedRoles = ['owner', 'subowner', 'operator'];
        this._actions = [{
            name: 'add',
            aliases: ['set', 'promote']
        }, {
            name: 'remove',
            aliases: ['del', 'delete']
        }, {
            name: 'check',
            aliases: ['verify', 'ver', 'view']
        }]
    }
    async run({message, argsAlt, prefix, command, userDB, t}) {
        const errorEmbed = new MessageEmbed()
            .addField(t('commands:staffrole.howToUse'), t('commands:staffrole.usageFormats', { prefix, command }))
            .addField(t('commands:staffrole.rolesTitle'), this.client.staff.roles.map(role => `\`${role}\``).join(' **|** '))
            .setTimestamp(new Date())
            .setFooter(message.author.username, message.author.displayAvatarURL())
            .setColor(5289);
        if(!this.client.staff.hasSomeRoles(userDB.roles, this._allowedRoles)) return message.channel.send(t('commands:staffrole.dontHaveRole', {
            member: message.member,
            roles: this._allowedRoles.map(role => `\`${role}\``).join(', ')
        }));
        const action = argsAlt[0] ?
            this._actions.find(action => action.name === argsAlt[0].toLowerCase()
            || action.aliases.includes(argsAlt[0].toLowerCase())).name
            || false
            : false;
        if(!action) return message.channel.send(errorEmbed);
        const another = ['check'].includes(action);
        const user = argsAlt[1] ?
            message.mentions.users.first()
            || await this.client.users.fetch(argsAlt[1]).catch(() => {return false})
            || false
            : false;
        if(!user || (argsAlt[1].replace(/[^0-9]/g, '') !== user.id)) return message.channel.send(errorEmbed);
        const role = argsAlt[2] ? this.client.staff.roles.find(role => role === argsAlt[2].toLowerCase()) || false : false;
        if(!role && !another) return message.channel.send(t('commands:staffrole.invalidRole', { member: message.member }), errorEmbed);
        if(!this.client.staff.isHigher(this.client.staff.highestRole(userDB.roles), role) && !another) return message.channel.send(t('commands:staffrole.roleHigher', {
            member: message.member
        }), errorEmbed);
        const targetDB = await this.client.database.findOrCreate('Users', {_id: user.id});
        switch(action) {
            case 'add': {
                if(targetDB.roles.includes(role)) return message.channel.send(t('commands:staffrole.hasRole', {
                    member: message.member,
                    role
                }));
                this.client.staff.addRole(user.id, role);
                message.channel.send(t('commands:staffrole.added', { member: message.member, role, target: user.tag }));
            } break;
            case 'remove': {
                if(!targetDB.roles.includes(role)) return message.channel.send(t('commands:staffrole.noHasRole', {
                    member: message.member,
                    role
                }));
                this.client.staff.removeRole(user.id, role);
                message.channel.send(t('commands:staffrole.removed', { member: message.member, role, target: user.tag }));
            } break;
            case 'check': {
                const result = new MessageEmbed()
                    .setAuthor(t('commands:staffrole.checkTitle', { user: user.username }), user.displayAvatarURL())
                    .setDescription(targetDB.roles.map(role => `\`${role}\``).join(' **|** '))
                    .setThumbnail(user.displayAvatarURL())
                    .setTimestamp(new Date())
                    .setFooter(message.author.username, message.author.displayAvatarURL())
                    .setColor(5289);
                message.channel.send(result);
            }
        }
    }
}