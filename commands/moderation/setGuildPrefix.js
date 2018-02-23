const winstonLogHandler = require('../../handler/winstonLogHandler');
const mariadbHandler = require('../../handler/mariadbHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'setguildprefix',
    description: 'Sets the Prefix for the Guild the author is in if he has the Permissions to do so.',
    async execute(client, message, args) {
        if (!message.guild) return;
        if (message.member.hasPermission('MANAGE_GUILD')) {
            const guildId = message.guild.id;
            const prefix = args.join(' ');
            try {
                await mariadbHandler.functions.setGuildPrefix(prefix, guildId);
            } catch (error) {
                logger.error(`${error.code} ${error.sqlMessage}`);
            }
            message.channel.send(`Set the Prefix to ${prefix}`);
        } else {
            message.channel.send(`You dont have the Permissions to set the Prefix for this Server!`);
        }
    },
};