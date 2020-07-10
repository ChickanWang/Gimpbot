const Discord = require('discord.js');
const yts = require('yt-search');
const ytdl = require("ytdl-core");
const bot = new Discord.Client();

const token = 'NzI3NjA4MzAzMTI2ODM5MzU2.XvuUWA.fibdB8BYSAvN0IE1F7c3jlV-fuU';
const PREFIX = 'gimpbot ';
const videos = {};

var servers = {};

bot.on('ready', () => {
    console.log('GimpBot is now online.');
})

// Actual important function
bot.on('message', message =>{

    let args = message.content.substring(PREFIX.length).split(" ");

    for (i = 1; i < args.length; i++)
    {
        var str = str + args[i] + " ";
    }

    switch(args[0])
        {
            case 'play':

                if(!servers[message.guild.id]) servers[message.guild.id] = {
                    queue:[]                    
                }

                function play(connection, message)
                {
                    var server = servers[message.guild.id];

                    yts( str, function ( err, r ) 
                    {
                        const videos = r.videos
                        var url = videos[0].url;

                        server.dispatcher = connection.play(ytdl(url, {filter: "audioonly"}));
                        message.channel.send('Now Playing ' + videos[0].title +"\n" + url)
                      } )
                }

                if(!args[1])
                {
                    message.channel.send('Give me something to search for -_-');
                    return;
                }

                if(!message.member.voice.channel)
                {
                    message.channel.send('Join a voice channel to play something');
                    return;
                }

                var server = servers[message.guild.id];

                if(!message.member.voice.connection) message.member.voice.channel.join().then(function(connection)
                {
                    play(connection, message);
                })
                break;
        
            case 'stop':
                var server = servers[message.guild.id]; 
                if(message.member.voice.connection)
                {
                    for(var i = server.queue.length - 1; i >=0; i--)
                    {
                        server.queue.splice(i, 1);
                    }
                    server.dispatcher.end();
                }

                if(message.guild.voice.connection)
                {
                    message.guild.voice.connection.disconnect();
                }
                break;
        }
})

bot.login(token);