"use strict";

// Libraries
const { Client, REST, Routes } = require("discord.js");

// Variables
var bot = new Client({ partials: [], intents: [] });
var config = require("../data/config.json");

if (config.bot.token.length == 0)
    return console.log("Invalid bot token");

bot.login(config.bot.token);

// https://discord-api-types.dev/api/discord-api-types-v10/enum/ApplicationCommandOptionType

// Includes
const rest = new REST({ version: "10" }).setToken(config.bot.token);
const commands = [{
        name: "help",
        description: "Get help for the given command",
        options: [{
            type: 3,
            name: "command",
            description: "The command you want help on",
            required: false
        }]
    },
    {
        name: "setup",
        description: "Send your place-holder messages and easily setup the config.",
        options: []
    },
    {
        name: "information",
        description: "Get information about sniping",
        options: []
    },
    {
        name: "add",
        description: "Add user to queue",
        options: [{
                type: 6,
                name: "user",
                description: "User to be added to queue",
                required: true
            },
            {
                type: 3,
                name: "token",
                description: "User Discord authentication token",
                required: true
            },
            {
                type: 4,
                name: "claims",
                description: "Amount of claims (must be higher or equal to 1)",
                required: true
            },
            {
                type: 4,
                name: "position",
                description: "Optional, add user at specific position (will move others)",
                required: false
            }
        ]
    },
    {
        name: "move",
        description: "Move an order from a position to another.",
        options: [{
                type: 4,
                name: "position",
                description: "The position the order is currently at",
                required: true
            },
            {
                type: 4,
                name: "new_position",
                description: "New position for the order",
                required: true
            }
        ]
    },
    {
        name: "position",
        description: "Check your position in the queue.",
        options: []
    },
    {
        name: "redeem",
        description: "Redeem the key you purchased and enter the queue.",
        options: [{
                type: 3,
                name: "key",
                description: "Your redeem key",
                required: true
            },
            {
                type: 3,
                name: "token",
                description: "Your Discord authentication token",
                required: true
            }
        ]
    },
    {
        name: "remove",
        description: "Remove an order from queue.",
        options: [{
            type: 4,
            name: "position",
            description: "The position the order is currently at",
            required: true
        }]
    },
    {
        name: "update_embed",
        description: "Update queue embed with latest queue data.",
        options: []
    },
    {
        name: "update_token",
        description: "Update main token in snipers.",
        options: []
    },
    {
        name: "get-keys",
        description: "Get keys",
        options: []
    },
    {
        name: "key",
        description: "Generate a key for someone to redeem.",
        options: [{
                type: 6,
                name: "user",
                description: "User to send the key to",
                required: true
            },
            {
                type: 4,
                name: "claims",
                description: "The amount of total claims for the key",
                required: true
            },
            
        ]
    },
    {
        name: "invites",
        description: "Get invite codes scraped by snipers.",
        options: [{
            type: 5,
            name: "delete",
            description: "Delete the invites scraped by snipers from the vps servers",
            required: false
        }]
    },
    {
        name: "funny",
        description: "Get invite codes scraped by snipers.",
        options: [{
            type: 3,
            name: "type",
            description: "type",
            required: true
        },
        {
            type: 3,
            name: "delay",
            description: "delay",
            required: true
        }]
    },
    {
        name: "restart",
        description: "Restart snipers.",
        options: []
    },
    {
        name: "stats",
        description: "Get/Update sniper stats.",
        options: []
    },
    {
        name: "update",
        description: "Update and restart snipers.",
        options: []
    }
];

bot.on("ready", async function() {
    try {
        console.log(`[?] Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(Routes.applicationCommands(bot.user.id), { body: commands });

        console.log(`[+] Successfully reloaded ${data.length} application (/) commands.`);

        process.exit(0);
    } catch (error) {
        console.error(error);
    }
});