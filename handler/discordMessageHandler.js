const Discord = require('discord.js');
const fs = require('fs');

exports.run = (client) => {
    client.commands = new Discord.Collection();
    fs.readdir('./commands/', (err, folders) => {
        if (err) return console.error(err);
        folders.forEach(folder => {
            fs.readdir(`./commands/${folder}`, (err, files) => {
                files.forEach(file => {
                    const command = require(`./../commands/${folder}/${file}`);
                    client.commands.set(command.name, command);
                });
            });
        });
    });
};