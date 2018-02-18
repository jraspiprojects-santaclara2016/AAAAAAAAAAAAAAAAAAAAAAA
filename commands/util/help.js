const Discord = require('discord.js');

const config = require('../../configuration/config');

module.exports = {
    name: 'help',
    description: 'Display the help page.',
    execute(client, message, args, logger) {
        const commandCollection = client.commands;
        const text = `\n___**Commands:**___
${commandCollection.map(command => `**-${config.commandPrefix}${command.name}** - ${command.description}`).join('\n')}`;
        message.author.send(text);
    },
};