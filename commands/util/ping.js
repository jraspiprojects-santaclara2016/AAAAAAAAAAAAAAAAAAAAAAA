module.exports = {
    name: 'ping',
    description: 'pong!',
    execute(client, message, args, logger) {
        message.channel.send('pong!').catch(console.error);
    },
};