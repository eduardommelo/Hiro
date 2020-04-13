module.exports = async(client) => {
    console.log(`[DiscordBot] ${client.user.tag} iniciado com sucesso.`);
    client.user.setPresence({activity: {name: `with ZeroTwo | ${await client.shardsInfo('guilds.cache.size')} servers.` }, status: 'online'});
    setInterval(async() => {
        client.user.setPresence({activity: {name: `with ZeroTwo | ${await client.shardsInfo('guilds.cache.size')} servers.` }, status: 'online'});
    }, (5 * 60) * 1000)
    client.register.fileCommands('./commands');
}