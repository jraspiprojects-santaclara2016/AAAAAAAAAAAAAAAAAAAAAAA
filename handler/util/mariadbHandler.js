const mysql = require('promise-mysql');
const secretHandler = require('./secretHandler');
const logHandler = require('./winstonLogHandler');
const logger = logHandler.getLogger();

const pool = mysql.createPool(secretHandler.getDatabaseSecrets());

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
    setFavPlaylist: async function(favPlaylist, userId) {
        const connection = await pool.getConnection();
        const escapedPlaylist = connection.escape(favPlaylist);
        const setFavPlaylist = `INSERT INTO discordUser (favPlaylist, discordId) VALUES(${escapedPlaylist}, ${userId}) ON DUPLICATE KEY UPDATE favPlaylist = ${escapedPlaylist}`;
        try {
            await connection.query(setFavPlaylist);
            return true;
        } catch (error) {
            logger.error('mariadbHandler: Error executing setFavPlaylist: ${error}');
            return false;
        } finally {
            connection.release();
        }
    },
    getFavPlaylist: async function(userId) {
        const connection = await pool.getConnection();
        const getFavPlaylist = `SELECT favPlaylist FROM discordUser WHERE discordId = ${userId}`;
        try {
            // TODO Possible checks
            return await connection.query(getFavPlaylist);
        } catch (error) {
            logger.error('mariadbHandler: Error executing getFavPlaylist: ${error}');
            return false;
        } finally {
            connection.release();
        }
    },
    setGuildPrefix: async function(prefix, guildId) {
        const connection = await pool.getConnection();
        const escapedPrefix = connection.escape(prefix);
        const setGuildPrefix = `INSERT INTO guildConfiguration (guildId, prefix) VALUES(${guildId}, ${escapedPrefix}) ON DUPLICATE KEY UPDATE prefix = ${escapedPrefix}`;
        try {
            await connection.query(setGuildPrefix);
            return true;
        } catch (error) {
            logger.error('mariadbHandler: Error executing setGuildPrefix: ${error}');
            return false;
        } finally {
            connection.release();
        }
    },
    getGuildPrefix: async function(guildId) {
        const connection = await pool.getConnection();
        const getGuildPrefix = `SELECT prefix FROM guildConfiguration WHERE guildId = ${guildId}`;
        try {
            // TODO possible checks
            return await connection.query(getGuildPrefix);
        } catch (error) {
            logger.error('mariadbHandler: Error executing getGuildPrefix: ${error}');
            return false;
        } finally {
            connection.release();
        }
    },
};

module.exports = {
    functions,
};