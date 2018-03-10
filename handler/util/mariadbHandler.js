const mysql = require('mysql');
const databaseConfig = require('../../configuration/databaseConfig.json');
const logHandler = require('./winstonLogHandler');
const logger = logHandler.getLogger();

const pool = mysql.createPool(databaseConfig);

pool.on('acquire', function(connection) {
    logger.verbose('mariadbHandler: Connection %d acquired', connection.threadId);
});
pool.on('enqueue', function() {
    logger.verbose('mariadbHandler: Waiting for available connection slot');
});
pool.on('release', function(connection) {
    logger.verbose('mariadbHandler: Connection %d released', connection.threadId);
});

const functions = {
    setFavPlaylist: function(favPlaylist, userId) {
        return new Promise(function(resolve, reject) {
            pool.getConnection(function(err, connection) {
                const escapedPlaylist = connection.escape(favPlaylist);
                const setFavPlaylist = `INSERT INTO discordUser (favPlaylist, discordId) VALUES(${escapedPlaylist}, ${userId}) ON DUPLICATE KEY UPDATE favPlaylist = ${escapedPlaylist}`;
                connection.query(setFavPlaylist, function(error, results) {
                    if (error) {
                        reject(error);
                    }
                    resolve(results);
                    connection.release();
                });
            });
        });
    },
    getFavPlaylist: function(userId) {
        return new Promise(function(resolve, reject) {
            pool.getConnection(function(err, connection) {
                const getFavPlaylist = `SELECT favPlaylist FROM discordUser WHERE discordId = ${userId}`;
                connection.query(getFavPlaylist, function(error, results) {
                    if (error) {
                        reject(error);
                    }
                    resolve(results);
                    connection.release();
                });
            });
        });
    },
    setGuildPrefix: function(prefix, guildId) {
        return new Promise(function(resolve, reject) {
            pool.getConnection(function(err, connection) {
                const escapedPrefix = connection.escape(prefix);
                const setGuildPrefix = `INSERT INTO guildConfiguration (guildId, prefix) VALUES(${guildId}, ${escapedPrefix}) ON DUPLICATE KEY UPDATE prefix = ${escapedPrefix}`;
                connection.query(setGuildPrefix, function(error, results) {
                    if (error) {
                        reject(error);
                    }
                    resolve(results);
                    connection.release();
                });
            });
        });
    },
    getGuildPrefix: function(guildId) {
        return new Promise(function(resolve, reject) {
            pool.getConnection(function(err, connection) {
                const getGuildPrefix = `SELECT prefix FROM guildConfiguration WHERE guildId = ${guildId}`;
                connection.query(getGuildPrefix, function(error, results) {
                    if (error) {
                        reject(error);
                    }
                    resolve(results);
                    connection.release();
                });
            });
        });
    },
    getEnableLiveGameStatsForDiscordId: function(discordId) {
        return new Promise(function(resolve, reject) {
            pool.getConnection(function(err, connection) {
                const selectSummonerNames = `SELECT enableLiveGameStats FROM discordUser WHERE discordUser.discordId = ${connection.escape(discordId)}`;
                connection.query(selectSummonerNames, function(error, results) {
                    if (error) {
                        reject(error);
                    }
                    resolve(results);
                    connection.release();
                });
            });
        });
    },
    getLeagueAccountsOfDiscordId: function(discordId) {
        return new Promise(function(resolve, reject) {
            pool.getConnection(function(err, connection) {
                const selectSummonerNames = `SELECT summonerName, region, isMain FROM summonerNames, discordUser WHERE summonerNames.discordId = discordUser.discordId AND discordUser.discordId = ${connection.escape(discordId)}`;
                connection.query(selectSummonerNames, function(error, results) {
                    if (error) {
                        reject(error);
                    }
                    resolve(results);
                    connection.release();
                });
            });
        });
    },
    addLeagueAccount: function(summonerName, region, discordId, isMain) {
        return new Promise(function(resolve, reject) {
            pool.getConnection(function(err, connection) {
                const insertDiscordId = `INSERT INTO discordUser (discordId) VALUES (${connection.escape(discordId)})`;
                const insertSummonerName = `INSERT INTO summonerNames (summonerName, region, discordId, isMain) VALUES (${connection.escape(summonerName)}, ${connection.escape(region)}, ${connection.escape(discordId)}, ${connection.escape(isMain)})`;
                connection.query(insertDiscordId);
                connection.query(insertSummonerName, function(error, results) {
                    if (error) reject(error);
                    resolve(results);
                });
                connection.release();
            });
        });
    },
    deleteLeagueAccount: function(summonerName, discordId) {
        return new Promise(function(resolve, reject) {
            pool.getConnection(function(err, connection) {
                const deleteSummonerName = `DELETE FROM summonerNames WHERE summonerName = ${connection.escape(summonerName)} AND discordId = ${connection.escape(discordId)}`;
                connection.query(deleteSummonerName, function(error, results) {
                    if (error) reject(error);
                    resolve(results);
                });
                connection.release();
            });
        });
    },
};

module.exports = {
    functions,
};