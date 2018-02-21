const winstonLogHandler = require('../../handler/winstonLogHandler');
const mariadbHandler = require('../../handler/mariadbHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'showGuildPrefix',
    description: 'Shows the Prefix for the Guild the message author is in.',
    async execute(client, message) {
        if (!message.guild) return;
        const guildId = message.guild.id;
        const prefix = mariadbHandler.functions.getGuildPrefix(guildId);
        try {
            await message.channel.send(`The Prefix is ${prefix}`);
        } catch (error) {
            logger.error(`showGuildPrefix: Error while trying to send Prefix: ${error}`);
        }

    },
};