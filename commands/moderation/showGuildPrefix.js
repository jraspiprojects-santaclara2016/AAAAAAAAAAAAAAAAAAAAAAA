const winstonLogHandler = require('../../handler/winstonLogHandler');
const mariadbHandler = require('../../handler/mariadbHandler');
const config = require('../../configuration/config');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'showguildprefix',
    description: 'Shows the Prefix for the Guild the message author is in.',
    async execute(client, message) {
        if (!message.guild) return;
        const guildId = message.guild.id;
        const result = await mariadbHandler.functions.getGuildPrefix(guildId);
        let prefix;
        if (result.length === 1) {
            prefix = result[0].prefix;
        } else {
            prefix = config.commandPrefix
        }
        try {
            await message.channel.send(`The Prefix is ${prefix}`);
        } catch (error) {
            logger.error(`showGuildPrefix: Error while trying to send Prefix: ${error}`);
        }

    },
};