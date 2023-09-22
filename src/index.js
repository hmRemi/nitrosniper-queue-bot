"use strict";

// Libraries
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { readdir, readdirSync } = require("fs");

// Variables
var bot = new Client({ sync: false, fetchAllMembers: false, partials: [Partials.Channel], intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages] });
var config = require("./data/config.json");

readdir("./commands/", (error, files) => {
    if (error) return console.log(error);

    var totalCommands = 0;

    files.forEach(file => { totalCommands += readdirSync(`./commands/${file}`).length; });

    console.log("[+] Loading a total of %d commands (%d categories)", totalCommands, files.length);
});

readdir("./events/", (error, files) => {
    if (error) return console.log(error);

    console.log("[+] Loading a total of %d events\r\n", files.length);

    files.forEach(file => {
        const eventName = file.split(".")[0];
        const event = require(`./events/${file}`);

        bot.on(eventName, event.bind(null, bot));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
});

console.log("[?] Make sure you have updated config.json\r\n");

bot.login(config.bot.token);

module.exports = { config: config, bot: bot };