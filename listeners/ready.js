module.exports = (client) =>{
    console.log('Bot ' + client.user.tag + ' ligado com sucesso.')
    client.register.fileCommands('./commands')
}