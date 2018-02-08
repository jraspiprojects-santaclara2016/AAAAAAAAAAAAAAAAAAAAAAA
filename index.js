/**
 * This is the index file from MonikaBot.
 * @author emdix
 **/

/*
 *todo implement errorEmbedHandler everywhere
 *todo implement winston logger everywhere
 */

//Require needed npm modules.
const Discord = require('discord.js');
//Create a Discord client object.
const client = new Discord.Client();

//Require my own 'handlers'
const discordEventHandler = require('./handler/discordEventHandler');
const winstonLogHandler = require('./handler/winstonLogHandler');
const discordLoginHandler = require('./handler/discordLoginHandler');

//create logger
const logger = winstonLogHandler.run();

//dynamic event caller
discordEventHandler.run(client, logger);

//connect the bot to the discord servers.
discordLoginHandler.run(client, logger);

/*
Every day, I imagine a future where I can be with you
In my hand is a pen that will write a poem of me and you
The ink flows down into a dark puddle
Just move your hand - write the way into his heart!
But in this world of infinite choices
What will it take just to find that special day?
What will it take just to find that special day?

Have I found everybody a fun assignment to do today?
When you're here, everything that we do is fun for them anyway
When I can't even read my own feelings
What good are words when a smile says it all?
And if this world won't write me an ending
What will it take just for me to have it all?

Does my pen only write bitter words for those who are dear to me?
Is it love if I take you, or is it love if I set you free?
The ink flows down into a dark puddle
How can I write love into reality?
If I can't hear the sound of your heartbeat
What do you call love in your reality?
And in your reality, if I don't know how to love you
I'll leave you be.
*/