const winstonLogHandler = require('../util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    sendEmbed(file, embed, channel) {
        logger.debug(`${file}: I try to send an embed.`);
        channel.send(embed).then(() => {
            logger.debug(`${file}: Embed sent successfully!`);
        }).catch(error => {
            logger.error(`${file}: Error while sending an embed: ${error}`);
        });
    },
    sendMessage(file, message, channel) {
        logger.debug(`${file}: I try to send a message.`);
        channel.send(message).then(() => {
            logger.debug(`${file}: message sent successfully!`);
        }).catch(error => {
            logger.error(`${file}: Error while sending an message: ${error}`);
        });
    },
};