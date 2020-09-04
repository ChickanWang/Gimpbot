const Discord = require('discord.js');
const yts = require('yt-search');
const ytdl = require("ytdl-core");
const bot = new Discord.Client();
const puppeteer = require('puppeteer');

const token = "NzI3NjA4MzAzMTI2ODM5MzU2.XvuUCQ.cS6KAwBQhudOaCc6b-EQESPt0j0";
const PREFIX = 'gimpbot ';
const videos = {};

var url = '';

var servers = {};

bot.on('ready', () => {
    console.log('GimpBot is now online.');
})

// Actual important function
bot.on('message', message => {

    let args = message.content.substring(PREFIX.length).split(" ");

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

                    server.dispatcher = connection.play(ytdl(url, { filter: "audioonly" }));
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
            message.channel.send("Processing... Results will be sent in about 15 seconds.");
            async function scrapeRunes(url, callback) {
                let browser = await puppeteer.launch({
                    headless: true,
                    args: [
                      '--no-sandbox',
                      '--disable-setuid-sandbox',
                    ],
                  });
                let page = await browser.newPage();
                await page.goto(url, { waitUntil: 'networkidle2' });

                data = await page.evaluate(async function evaluate() {

                    if (document.querySelector('div [class = "Description__Title-jfHpQH bJtdXG"]') != null) {
                        keystone = document.querySelector('div [class = "Description__Title-jfHpQH bJtdXG"]').innerText;
                        slot1 = document.querySelectorAll('div [class = "Description__Title-jfHpQH bJtdXG"]')[1].innerText;
                        slot2 = document.querySelectorAll('div [class = "Description__Title-jfHpQH bJtdXG"]')[2].innerText;
                        slot3 = document.querySelectorAll('div [class = "Description__Title-jfHpQH bJtdXG"]')[3].innerText;

                        secondary = document.querySelectorAll('div [class = "Description__Title-jfHpQH eOLOWg"]')[0].innerText;
                        secondary1 = document.querySelectorAll('div [class = "Description__Title-jfHpQH eOLOWg"]')[1].innerText;
                        secondary2 = document.querySelectorAll('div [class = "Description__Title-jfHpQH eOLOWg"]')[2].innerText;

                        runes = "**KEYSTONE:** " + keystone + " \n**Slot 1:** " + slot1 + " \n**Slot 2:** " + slot2 + " \n**Slot 3:** " + slot3 + " \n**SECONDARY KEYSTONE:** " + secondary + " \n**Slot 1:** " + secondary1 + " \n**Slot 2:** " + secondary2;
                    }
                    else {
                        runes = "The champion you typed in doesn't exist."
                    }

                    return runes;
                });

                await browser.close();
                callback(data);
            }

            url = 'https://champion.gg/champion/' + args[1];

            scrapeRunes(url, function (data) {
                message.channel.send(data);
            });
            break;

        case 'help':
            message.channel.send("**List of Commands:** \ngimpbot play - joins a voice channel and plays whatever song you type in \ngimpbot stop - stops the music and leaves the voice channel. \ngimpbot runes - sends you the highest winrate runes for the champion you indicate. \ngimpbot summoner - sends you the stats of a league summoner, make sure to add %20 where a space should be in the summoner name!");
            break;

        case 'summoner':
            message.channel.send("Processing... Results will be sent in about 15 seconds.");

            async function scrapeStats(url, callback) {
                let browser = await puppeteer.launch({
                    headless: true,
                    args: [
                      '--no-sandbox',
                      '--disable-setuid-sandbox',
                    ],
                  });
                let page = await browser.newPage();
                await page.goto(url, { waitUntil: 'networkidle2' });

                data = await page.evaluate(async function evaluate() {

                    solorank = "**Solo/Duo Rank:** Unranked";
                    sololp = "**Solo/Duo LP:** N/A";
                    solowinrate = "**Solo/Duo Winrate:** N/A";

                    if (document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div > div.queue-typesstyles__QueueTypesWrapper-sc-1fmhw98-1.jFDMy > div > div:nth-child(1) > span.queue-typesstyles__Name-sc-1fmhw98-7.dGGawh") != null) {
                        if (document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div > div.queue-typesstyles__QueueTypesWrapper-sc-1fmhw98-1.jFDMy > div > div:nth-child(1) > span.queue-typesstyles__Name-sc-1fmhw98-7.dGGawh").innerText == "Ranked Solo") {
                            solorank = "**Solo/Duo Rank:** " + document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div.queue-typesstyles__Wrapper-sc-1fmhw98-0.fvRwEu.profile-headerstyles__GameQueueTypesStyled-c1e39t-3.hIeBJz > div.queue-typesstyles__QueueTypesWrapper-sc-1fmhw98-1.jFDMy > div > div:nth-child(1) > span.queue-typesstyles__Tier-sc-1fmhw98-6.kufjlh").innerText;
                            sololp = "**Solo/Duo LP:** " + document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div.queue-typesstyles__Wrapper-sc-1fmhw98-0.fvRwEu.profile-headerstyles__GameQueueTypesStyled-c1e39t-3.hIeBJz > div.queue-typesstyles__QueueTypesWrapper-sc-1fmhw98-1.jFDMy > div > div:nth-child(2) > span.queue-typesstyles__LP-sc-1fmhw98-8.iMFPyB").innerText;

                            if (document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div.queue-typesstyles__Wrapper-sc-1fmhw98-0.fvRwEu.profile-headerstyles__GameQueueTypesStyled-c1e39t-3.hIeBJz > div.queue-typesstyles__QueueTypesWrapper-sc-1fmhw98-1.jFDMy > div > div:nth-child(2) > div.win-ratestyles__Wrapper-rcu1rv-0.kOsNty") != null) {
                                solowinrate = "**Solo/Duo Winrate:** " + document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div.queue-typesstyles__Wrapper-sc-1fmhw98-0.fvRwEu.profile-headerstyles__GameQueueTypesStyled-c1e39t-3.hIeBJz > div.queue-typesstyles__QueueTypesWrapper-sc-1fmhw98-1.jFDMy > div > div:nth-child(2) > div.win-ratestyles__Wrapper-rcu1rv-0.kOsNty").innerText;
                            }
                            else if (document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div > div.queue-typesstyles__QueueTypesWrapper-sc-1fmhw98-1.jFDMy > div > div:nth-child(2) > div.win-ratestyles__Wrapper-rcu1rv-0.ctzMeU") != null) {
                                solowinrate = "**Solo/Duo Winrate:** " + document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div > div.queue-typesstyles__QueueTypesWrapper-sc-1fmhw98-1.jFDMy > div > div:nth-child(2) > div.win-ratestyles__Wrapper-rcu1rv-0.ctzMeU").innerText;
                            }
                            else if (document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div.queue-typesstyles__Wrapper-sc-1fmhw98-0.fvRwEu.profile-headerstyles__GameQueueTypesStyled-c1e39t-3.hIeBJz > div.queue-typesstyles__QueueTypesWrapper-sc-1fmhw98-1.jFDMy > div > div:nth-child(2) > div.win-ratestyles__Wrapper-rcu1rv-0.dyPxOK") != null) 
                            {
                                solowinrate = "**Solo/Duo Winrate:** " + document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div.queue-typesstyles__Wrapper-sc-1fmhw98-0.fvRwEu.profile-headerstyles__GameQueueTypesStyled-c1e39t-3.hIeBJz > div.queue-typesstyles__QueueTypesWrapper-sc-1fmhw98-1.jFDMy > div > div:nth-child(2) > div.win-ratestyles__Wrapper-rcu1rv-0.dyPxOK").innerText;
                            }
                        }
                    }
                
                    // If summoner plays both Ranked Flex and Solo/Duo
                    if (document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div > div.queue-typesstyles__QueueTypesWrapper-sc-1fmhw98-1.jZdSRv > div > div:nth-child(1) > span.queue-typesstyles__Tier-sc-1fmhw98-6.kufjlh") != null) 
                    {
                        flexrank = "**Ranked Flex:** " + document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div > div.queue-typesstyles__QueueTypesWrapper-sc-1fmhw98-1.jZdSRv > div > div:nth-child(1) > span.queue-typesstyles__Tier-sc-1fmhw98-6.kufjlh").innerText;
                        
                        // Green Winrate
                        if (document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div > div.queue-typesstyles__QueueTypesWrapper-sc-1fmhw98-1.jZdSRv > div > div:nth-child(2) > div.win-ratestyles__Wrapper-rcu1rv-0.WlNde") != null)
                        {                           
                            flexwinrate = "**Ranked Flex Winrate:** " + document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div > div.queue-typesstyles__QueueTypesWrapper-sc-1fmhw98-1.jZdSRv > div > div:nth-child(2) > div.win-ratestyles__Wrapper-rcu1rv-0.WlNde").innerText;
                        }
                        
                        // Orange Winrate
                        else if (document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div > div.queue-typesstyles__QueueTypesWrapper-sc-1fmhw98-1.jZdSRv > div > div:nth-child(2) > div.win-ratestyles__Wrapper-rcu1rv-0.kOsNty") != null)
                        {                            
                            flexwinrate = "**Ranked Flex Winrate:** " + document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div > div.queue-typesstyles__QueueTypesWrapper-sc-1fmhw98-1.jZdSRv > div > div:nth-child(2) > div.win-ratestyles__Wrapper-rcu1rv-0.dyPxOK").innerText;
                        }

                        // Red Winrate
                        else if (document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div > div.queue-typesstyles__QueueTypesWrapper-sc-1fmhw98-1.jZdSRv > div > div:nth-child(2) > div.win-ratestyles__Wrapper-rcu1rv-0.dyPxOK") != null) 
                        {                          
                            flexwinrate = "**Ranked Flex Winrate:** " + document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div.queue-typesstyles__Wrapper-sc-1fmhw98-0.fvRwEu.profile-headerstyles__GameQueueTypesStyled-c1e39t-3.hIeBJz > div.queue-typesstyles__QueueTypesWrapper-sc-1fmhw98-1.jFDMy > div > div:nth-child(2) > div.win-ratestyles__Wrapper-rcu1rv-0.dyPxOK").innerText;
                        }
                        
                        if (flexrank == "Ranked Flex")
                        {
                            flexrank = "**Ranked Flex** = Unranked";
                        }
                    }

                    // If summoner only plays Ranked Flex
                   else if (document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div.queue-typesstyles__Wrapper-sc-1fmhw98-0.fvRwEu.profile-headerstyles__GameQueueTypesStyled-c1e39t-3.hIeBJz > div > div > div:nth-child(1) > span.queue-typesstyles__Name-sc-1fmhw98-7.dGGawh") != null)
                    {
                        if(document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div.queue-typesstyles__Wrapper-sc-1fmhw98-0.fvRwEu.profile-headerstyles__GameQueueTypesStyled-c1e39t-3.hIeBJz > div > div > div:nth-child(1) > span.queue-typesstyles__Name-sc-1fmhw98-7.dGGawh").innerText == "Ranked Flex")
                            {
                                flexrank = "**Ranked Flex:** " + document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div > div > div > div:nth-child(1) > span.queue-typesstyles__Tier-sc-1fmhw98-6.kufjlh").innerText;
                                
                                // Green Winrate
                                if (document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div > div > div > div:nth-child(2) > div.win-ratestyles__Wrapper-rcu1rv-0.WlNde") != null)
                                {
                                    flexwinrate = "**Ranked Flex Winrate:** " + document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div > div > div > div:nth-child(2) > div.win-ratestyles__Wrapper-rcu1rv-0.WlNde").innerText;
                                }

                                // Orange Winrate
                                else if (document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div > div > div > div:nth-child(2) > div.win-ratestyles__Wrapper-rcu1rv-0.kOsNty") != null)     
                                {
                                    flexwinrate = "**Ranked Flex Winrate:** " + document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div > div > div > div:nth-child(2) > div.win-ratestyles__Wrapper-rcu1rv-0.kOsNty").innerText;
                                }

                                // N/A
                                else if (document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div.queue-typesstyles__Wrapper-sc-1fmhw98-0.fvRwEu.profile-headerstyles__GameQueueTypesStyled-c1e39t-3.hIeBJz > div.queue-typesstyles__QueueTypesWrapper-sc-1fmhw98-1.jFDMy > div > div:nth-child(2) > div.win-ratestyles__Wrapper-rcu1rv-0.dyPxOK") != null) {
                                    flexwinrate = "**Ranked Flex Winrate:** " + document.querySelector("#root > div.app-global-styles__Wrapper-sc-1gx32ql-0.gFSaPZ > div > div.app-layoutstyles__PageWrapper-sc-156ap5b-0.hKEjlm > div.app-layoutstyles__PageContentWrapper-sc-156ap5b-1.cZkODc > div.profile-pagestyles__Wrapper-sc-1mx6rc2-0.GxxGR > div > div.profile-headerstyles__Wrapper-c1e39t-1.dGfHIB > div.profile-headerstyles__LeftCol-c1e39t-2.iaCqDu > div.queue-typesstyles__Wrapper-sc-1fmhw98-0.fvRwEu.profile-headerstyles__GameQueueTypesStyled-c1e39t-3.hIeBJz > div.queue-typesstyles__QueueTypesWrapper-sc-1fmhw98-1.jFDMy > div > div:nth-child(2) > div.win-ratestyles__Wrapper-rcu1rv-0.dyPxOK").innerText;
                                }
                            }
                        else 
                        {
                            flexrank = "**Ranked Flex** = Unranked";
                            flexwinrate = "**Ranked Flex Winrate:** = N/A";
                        }
                    }

                    // If summoner doesn't play at all.
                    else {
                        flexrank = "**Ranked Flex** = Unranked";
                        flexwinrate = "**Ranked Flex Winrate:** N/A"
                    }

                    let stats = solorank + "\n" + sololp + "\n" + solowinrate + "\n" + flexrank + "\n" + flexwinrate;

                    return stats;
                });

                await browser.close();
                callback(data);
            }

            url = 'https://app.mobalytics.gg/lol/profile/na/' + args[1] + '/overview';

            scrapeStats(url, function (data) {
                message.channel.send(data);
            });
            break;

    }
})

bot.login(token);
