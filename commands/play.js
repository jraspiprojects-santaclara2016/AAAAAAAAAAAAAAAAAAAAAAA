const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');

const voiceHandler = require('../handler/voiceHandler');
const apiKeyConfig = require('../configuration/apiKeyConfig');

const youtube = new YouTube(apiKeyConfig.youtube);

const queue = voiceHandler.getQueue();

exports.run = async (client, message, args, logger) => {
    const serverQueue = queue.get(message.guild.id);
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send('You need to be in a voice channel!');
    const permissions = voiceChannel.permissionsFor(client.user);
    if (!permissions.has('CONNECT')) {
        return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
    }
    if (!permissions.has('SPEAK')) {
        return message.channel.send('I cannot speak in your voice channel, make sure I have the proper permissions!');
    }

    if (args[0].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        const playlist = await youtube.getPlaylist(args[0]);
        const videos = await playlist.getVideos();
        message.channel.send(`The Playlist **${playlist.title}** has been added to the queue!`)
        for(const video of videos) {
            await handleVideo(video, message, voiceChannel, true);
        }
    } else {
        try {
            var video = await youtube.getVideo(args[0]);
        } catch (error) {
            try {
                var videos = await youtube.searchVideos(args.join(' '), 10)
                let index = 1;
                message.channel.send(`
___**Search results:**___
${videos.map(video => `**${index++} -** ${video.title}`).join('\n')}
    
***Usage: 1-10***`);
                try {
                    var response = await message.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
                        max: 1,
                        time: 10000,
                        errors: ['time']
                    });
                } catch (err) {
                    console.error(err);
                    return message.channel.send('No or invalid value entered, cancelling video selection.');
                }
                const videoIndex = parseInt(response.first().content);
                var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
            } catch (err) {
                console.error(err);
                return message.channel.send('I could not obtain any search results.');
            }
        }
        await handleVideo(video, message, voiceChannel);
    }

};

async function handleVideo(video, message, voiceChannel, playlist = false) {
    const serverQueue = queue.get(message.guild.id);
    const song = {
        id: video.id,
        title: video.title,
        url: `https://youtube.com/watch?v=${video.id}`
    };
    if(!serverQueue) {
        const queueObject = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 0.1,
            playing: true
        };
        queue.set(message.guild.id, queueObject);
        queueObject.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueObject.connection = connection;
            play(message.guild, queueObject.songs[0])
        } catch (error) {
            console.log(`I couldn't join the voice channel ${error}`);
            queue.delete(message.guild.id);
            message.channel.send(`I could not join the voice channel!`);
        }
    } else {
        serverQueue.songs.push(song);
        if(!playlist) {
            message.channel.send(`**${song.title}** has been added to the queue!`);
        }
    }
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if(!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    const dispatcher = serverQueue.connection.play(ytdl(song.url))
        .on('end', () => {
            console.log('song ended.');
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0])
        })
        .on('error', error => console.error(error));
    dispatcher.setVolume(serverQueue.volume);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`)
}