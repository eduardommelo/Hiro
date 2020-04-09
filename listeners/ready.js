module.exports = (client) => {
    console.log(`[DiscordBot] ${client.user.tag} iniciado com sucesso.`);
    client.register.fileCommands('./commands');
}