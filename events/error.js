/**
 * This file is for the error event that gets emitted whenever the bot cannot connect to the discord web socket.
 * @author emdix
 **/

//This segment is executed whenever the bot receives a error event
exports.run = (client, args) => {
    console.log(args.error.Error);
}