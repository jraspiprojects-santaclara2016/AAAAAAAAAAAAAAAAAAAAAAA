exports.run = (client, logger) => {
    client.login(process.env.DISCORD_TOKEN).then(() => {
        logger.info('I connected to the Discord server!');
    }).catch((error) => {
        logger.info('I had troubles connecting to the Discord servers!');
    });
};