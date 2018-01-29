/**
 * This is the index file from MonikaBot.
 * @author emdix
 **/

//Initialize the Discord.js module.
const Discord = require('discord.js');
//Initialize the http module.
const http = require('http');

//Load the config file for some configurable values.
const config = require('./configuration/config');

//Create a Discord client object.
const client = new Discord.Client();

//Client onReady() event.
client.on('ready', () =>{
    console.log('I\'m ready to follow your orders');
    client.user.setActivity(config.presenceGame).then((response) => {
        console.log('Presence set to: ' + response.presence.game.name);
    }).catch((error) => {
        console.log('I failed to set the Presence!');
        console.log(error);
    });
});

//Client onMessage() event.
client.on('message', message => {
    // Check if command starts with help.
    if(message.content.startsWith(config.commandPrefix + 'help')) {
        message.author.send('Test').then(() => {
            console.log('I executed the help command for UserID: ' + message.author.id);
        }).catch((error) => {
            console.log('I failed to send the help message to UserID: ' + message.author.id);
            console.log(error);
        });
    }
});

//This event is used to connect the bot to the Discord servers.
client.login(process.env.discordToken).then(() => {
    console.log('I connected to the Discord server!');
    //Needed for Heroku Web instance.
    http.createServer().listen(process.env.PORT || 6000);
}).catch((error) => {
    console.log('I had troubles connecting to the Discord servers!');
    console.log(error);
});
