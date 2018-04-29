const winstonLogHandler = require('./winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const mariadbHandler = require('./mariadbHandler');
const Discord = require('discord.js');
const fs = require('fs');

exports.run = async (client) => {
    client.commands = new Discord.Collection();
    try {
        const folders = fs.readdirSync('./commands/');
        folders.forEach(folder => {
            const files = fs.readdirSync(`./commands/${folder}`);
            files.forEach(file => {
                const command = require(`./../../commands/${folder}/${file}`);
                client.commands.set(command.name, command);
            });
        });
        if (await mariadbHandler.functions.checkDatabase()) {
            client.commands = client.commands.filter((value) => !value.requireDB);
            logger.info('discordMessageHandler: Disabled Database commands!');
        }
        logger.debug('discordMessageHandler: Success! All Commands were loaded successfully!');
    } catch (error) {
        logger.error(`discordMessageHandler: Error: ${error}`);
    }
};
