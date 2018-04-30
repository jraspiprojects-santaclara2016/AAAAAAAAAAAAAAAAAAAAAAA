const Discord = require('discord.js');
const lolApi = require('league-api-2.0');
const config = require('../../configuration/config');
const secretHandler = require('../../handler/util/secretHandler');
const configHandler = require('../../handler/util/configHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const discordCustomEmbedHandler = require('../../handler/command/discordCustomEmbedHandler');

module.exports = {
    name: 'lolstatus',
    description: 'Display the current status of the LeagueOfLegends server.',
    disabled: true,
    requireDB: false,
    execute(client, message, args) {
        const leagueConfig = configHandler.getLeagueConfig();
        lolApi.base.setBaseURL(leagueConfig.baseURL);
        lolApi.base.setRateLimit(leagueConfig.rateLimit);
        lolApi.base.setKey(secretHandler.getApiKey('LOL_KEY'));
        lolApi.base.setRegion('euw1');
        if (args[0] === undefined) {
            logger.verbose('Lolstatus: No Region from input.');
            const fields = [{
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
                const fields = [{
                    name: 'Invalid Input',
                    value: `${lolApi.base.region} is not a valid Region!`,
                }];
                discordCustomEmbedHandler.run(client, 'Error', fields, message.channel);
                return;
            } else {
                for (let i = 0; i < response.services.length; i++) {
                    const fields = {};
                    fields.name = response.services[i].name;
                    if (response.services[i].incidents.length === 0) {
                        fields.value = 'No Incidents Occured!';
                        embed.addField(fields.name, fields.value);
                    } else {
                        for (let j = 0; j < response.services[i].incidents.length; j++) {
                            fields.value = response.services[i].incidents[j].updates[0].content;
                            embed.addField(fields.name, fields.value);
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