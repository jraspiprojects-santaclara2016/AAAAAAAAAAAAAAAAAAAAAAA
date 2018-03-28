const winstonLogHandler = require('./winstonLogHandler');
const logger = winstonLogHandler.getLogger();
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
        logger.debug('discordMessageHandler: Success! All Commands were loaded successfully!');
    } catch (error) {
        logger.error(`discordMessageHandler: Error: ${error}`);
    }
};
