const winstonLogHandler = require('../../handler/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'prune',
    description: 'Delete the specified amount of messages from the current channel.',
    execute(client, message, args) {
        if (message.member.hasPermission('MANAGE_MESSAGES')) {
            message.channel.messages.fetch({ limit: args }).then(data => {
                data.deleteAll();
                message.channel.send(`deleted ${data.size} messages.`);
            }).catch(error => {
                logger.error(`prune: Error while pruning the Channel: ${error}`);
            });
        }
    },
};