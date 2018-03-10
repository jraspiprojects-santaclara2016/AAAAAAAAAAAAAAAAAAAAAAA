const winstonLogHandler = require('./winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const Discord = require('discord.js');
const fs = require('fs');

exports.run = (client) => {
    client.commands = new Discord.Collection();
    fs.readdir('./commands/', (err, folders) => {
        if (err) return logger.error(`discordMessageHandler: Error: ${err}`);
        folders.forEach(folder => {
            fs.readdir(`./commands/${folder}`, (err, files) => {
                files.forEach(file => {
                    const command = require(`./../../commands/${folder}/${file}`);
                    client.commands.set(command.name, command);
                });
            });
        });
    });
    logger.debug('discordMessageHandler: Success! All Commands were loaded successfully!');
};