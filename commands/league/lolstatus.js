const Discord = require('discord.js');
const lolApi = require('league-api-2.0');
const config = require('../../configuration/config');
const apiKeys = require('../../configuration/apiKeyConfig');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const discordCustomEmbedHandler = require('../../handler/command/discordCustomEmbedHandler');

module.exports = {
    name: 'lolstatus',
    description: 'Display the current status of the LeagueOfLegends server.',
    execute(client, message, args) {
        lolApi.base.loadConfig('./configuration/lolConfig.json');
        lolApi.base.setKey(apiKeys.leagueOfLegends);
        if (args[0] === undefined) {
            logger.verbose('Lolstatus: No Region from input.');
            let fields = [{
                name: 'Invalid Input',
                value: 'This command needs a valid Region',
            }];
            discordCustomEmbedHandler.run(client, 'Error', fields, message.channel);
            return;
        }
        lolApi.base.setRegion(args[0]);
        lolApi.executeCall('Status', 'getLolStatus').then((response) => {
            const embed = new Discord.MessageEmbed()
                .setTitle('Lolstatus command:')
                .setColor('DARK_GREEN')
                .setFooter('By ' + config.botName)
                .setTimestamp()
            ;
            logger.silly(`Lolstatus: Response: ${response}`);
            if (response.status) {
                logger.verbose('Lolstatus: Invalid Region Error.');
                let fields = [{
                    name: 'Invalid Input',
                    value: `${lolApi.base.region} is not a valid Region!`,
                }];
                discordCustomEmbedHandler.run(client, 'Error', fields, message.channel);
                return;
            } else {
                for (let i = 0; i < response.services.length; i++) {
                    let field = {};
                    field.name = response.services[i].name;
                    if (response.services[i].incidents.length === 0) {
                        field.value = 'No Incidents Occured!';
                        embed.addField(field.name, field.value);
                    } else {
                        for (let j = 0; j < response.services[i].incidents.length; j++) {
                            field.value = response.services[i].incidents[j].updates[0].content;
                            embed.addField(field.name, field.value);
                        }
                    }
                }
            }
            message.channel.send({ embed }).catch(error => logger.error(`Lolstatus: Error sending message: ${error}`));
        }).catch((error) => {
            logger.error(`Lolstatus: Error retrieving Api response: ${error}`);
        });
    },
};