const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'prune',
    description: 'Delete the specified amount of messages from the current channel.',
    async execute(client, message, args) {
        if(!await checkPermissions(message.author, message, 'MANAGE_MESSAGES')) return;
        if(!await checkPermissions(client.user, message, 'MANAGE_MESSAGES')) return;
        await fetchAndDeleteMessages(message, args[0]);
    },
};

async function checkPermissions(user, message, permission) {
    const permissionsCollection = message.channel.permissionsFor(user);
    if(permissionsCollection.has(permission)) {
        return true;
    } else {
        if(user === message.author) {
            message.channel.send('You do not have enough permissions to prune this channel! (MANAGE_MESSAGES)');
        } else {
            message.channel.send('I do not have enough permissions to prune this channel! (MANAGE_MESSAGES)');
        }
        return false;
    }
}

async function fetchAndDeleteMessages(message, limit) {
    message.channel.messages.fetch({ limit: limit }).then(fetchedMessages => {
        logger.debug('prune: Fetched messages.');
        deleteMessages(message, fetchedMessages);
    }).catch(error => {
        logger.error(`prune: Error while fetching the messages: ${error}`);
    });
}

async function deleteMessages(message, messages) {
    Promise.all(messages.deleteAll()).then(() => {
        logger.debug(`prune: Deleted ${messages.size} messages.`);
        message.channel.send(`Deleted ${messages.size} messages.`);
    }).catch(error => {
        logger.error(error);
        message.channel.send('There was an error while deleting the messages.');
    });
}