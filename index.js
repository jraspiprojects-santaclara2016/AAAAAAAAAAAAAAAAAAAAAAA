/**
 * This is the index file from MonikaBot.
 * @author emdix
 **/

//Require needed npm modules.
const Discord = require('discord.js');
const fs = require('fs');

//Load the config file for some configurable values.
const config = require('./configuration/config');

//Create a Discord client object.
const client = new Discord.Client();

//This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        let eventFunction = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        //super-secret recipe to call events with all their proper arguments *after* the `client` var.
        client.on(eventName, (...args) => eventFunction.run(client, ...args));
    });
});

//Client onMessage event.
client.on("message", message => {
    if (message.author.bot) return;
    if(message.content.indexOf(config.commandPrefix) !== 0) return;

    //This is the best way to define args. Trust me.
    const args = message.content.slice(config.commandPrefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    //This matches an incoming command with right command prefix to a file located in /commands/.
    try {
        let commandFile = require(`./commands/${command}.js`);
        commandFile.run(client, message, args);
    } catch (err) {
        console.error(err);
        message.channel.send(err)
    }
});

//This event is used to connect the bot to the Discord servers.
client.login(process.env.discordToken).then(() => {
    console.log('I connected to the Discord server!');
}).catch((error) => {
    console.log('I had troubles connecting to the Discord servers!');
    console.log(error);
});
