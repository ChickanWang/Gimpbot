const Discord = require('discord.js');
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const bot = new Discord.Client();
const puppeteer = require('puppeteer');

const token = 'NzI3NjA4MzAzMTI2ODM5MzU2.XvuUCQ.fOcG187NxHGeycrzdlF0fF16m6c';
const PREFIX = 'gimpbot ';
const videos = {};

var url = '';

var servers = {};

bot.on('ready', () => {
    console.log('GimpBot is now online.');
})

// Actual important function
bot.on('message', message => {

    let args = split(message.content.substring(PREFIX.length))

    if (!message.content.startsWith(PREFIX)) return;

    for (i = 1; i < args.length; i++) {
        var str = str + args[i] + " ";
    }

    switch (args[0]) {
        case 'play':

            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            function play(connection, message) {
                var server = servers[message.guild.id];

                yts(str, function (err, r) {
                    const videos = r.videos
                    var url = videos[0].url;

                    server.dispatcher = connection
                                        .play(ytdl(url, { filter: "audioonly" }))
                                        .on("error", error => console.error(error));

                    // server.dispatcher = connection.play(ytdl(url, { filter: "audioonly" }));
                    message.channel.send('Now Playing ' + videos[0].title + "\n" + url)
                })
            }

            if (!args[1]) {
                message.channel.send('Give me something to search for -_-');
                return;
            }

            if (!message.member.voice.channel) {
                message.channel.send('Join a voice channel to play something');
                return;
            }

            var server = servers[message.guild.id];

            if (!message.member.voice.connection) message.member.voice.channel.join().then(function (connection) {
                play(connection, message);
            })
            break;

        case 'stop':
            var server = servers[message.guild.id];
            if (message.member.voice.connection) {
                for (var i = server.queue.length - 1; i >= 0; i--) {
                    server.queue.splice(i, 1);
                }
                server.dispatcher.end();
            }

            if (message.guild.voice.connection) {
                message.guild.voice.connection.disconnect();
            }
            break;

        case 'runes':
            let search = args[1].replace(' ', '');
            message.channel.send("Processing... Results will be sent in about 15 seconds.");
            async function scrapeRunes(url, callback) {
                let browser = await puppeteer.launch({
                    headless: false,
                    args: [
                      '--no-sandbox',
                      '--disable-setuid-sandbox',
                    ],
                  });

                let page = await browser.newPage();

                await page.setDefaultNavigationTimeout(0);
                await page.goto(url, { waitUntil: 'networkidle2' });

                data = await page.evaluate(async function evaluate() {

                    if (document.querySelectorAll('div [class = "ChampionRuneSmallCHGG__RuneDetails-sc-1vubct9-6 sc-btewqU jitfUq"]')[0] != null) {
                        path1 = document.querySelectorAll('div [class = "ChampionRuneSmallCHGG__RuneDetails-sc-1vubct9-6 sc-btewqU jitfUq"]')[0].innerText
                        keystone = document.querySelectorAll('div [class = "ChampionRuneSmallCHGG__RuneDetails-sc-1vubct9-6 sc-jbWsrJ bfEIfW"]')[0].firstChild.innerText
                        slot1 = document.querySelectorAll('div [class = "ChampionRuneSmallCHGG__RuneDetails-sc-1vubct9-6 sc-jbWsrJ knHsxP"]')[0].firstChild.innerText
                        slot2 = document.querySelectorAll('div [class = "ChampionRuneSmallCHGG__RuneDetails-sc-1vubct9-6 sc-jbWsrJ knHsxP"]')[1].firstChild.innerText
                        slot3 = document.querySelectorAll('div [class = "ChampionRuneSmallCHGG__RuneDetails-sc-1vubct9-6 sc-jbWsrJ knHsxP"]')[2].firstChild.innerText

                        path2 = document.querySelectorAll('div [class = "ChampionRuneSmallCHGG__RuneDetails-sc-1vubct9-6 sc-ZUflv dYodSe"]')[0].innerText
                        secondary1 = document.querySelectorAll('div [class = "ChampionRuneSmallCHGG__RuneDetails-sc-1vubct9-6 hHxUYp"]')[0].firstChild.innerText
                        secondary2 = document.querySelectorAll('div [class = "ChampionRuneSmallCHGG__RuneDetails-sc-1vubct9-6 hHxUYp"]')[1].firstChild.innerText

                        shard1 = document.querySelectorAll('div [class = "ChampionRuneSmallCHGG__RuneDetails-sc-1vubct9-6 hHxUYp"]')[2].firstChild.innerText
                        shard2 = document.querySelectorAll('div [class = "ChampionRuneSmallCHGG__RuneDetails-sc-1vubct9-6 hHxUYp"]')[3].firstChild.innerText
                        shard3 = document.querySelectorAll('div [class = "ChampionRuneSmallCHGG__RuneDetails-sc-1vubct9-6 hHxUYp"]')[4].firstChild.innerText

                        runes = "__**" + path1 + "**__" + "\nKeystone: " + keystone + " \nSlot 1: " + slot1 + " \nSlot 2: " + slot2 + " \nSlot 3: " + slot3 + " \n__**" + path2 + "**__" +  "\nSlot 1: " + secondary1 + " \nSlot 2: " + secondary2 + "\n__**Shards**__" + " \nShard 1: " + shard1 + " \nShard 2: " + shard2 + " \nShard 3: " + shard3;
                    }
                    else {
                        runes = "The champion you typed in doesn't exist."
                    }

                    return runes;
                })

                await browser.close()

                callback(data);
            }

            url = 'https://champion.gg/champion/' + search

            scrapeRunes(url, function (data) {
                message.channel.send(data);
            });
            break;

        case 'help':
            message.channel.send("**List of Commands:** \ngimpbot play - joins a voice channel and plays whatever song you type in \ngimpbot stop - stops the music and leaves the voice channel. \ngimpbot runes - sends you the highest winrate runes for the champion you indicate.");
            break;
}})

function split(str) {
    if (! str) return [];
    var i = str.indexOf(' ');
    if (i > 0) {
      return [str.substring(0, i), str.substring(i + 1)];
    }
    else return [str];
  }

bot.login(token);
