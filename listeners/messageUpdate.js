module.exports = (client, oldMessage, newMessage) => {
    client.base.emitMessage([oldMessage, newMessage]);
}