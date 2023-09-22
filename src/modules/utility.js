"use strict";

// Libraries
const { EmbedBuilder } = require("discord.js");

// Includes
var index = require("../index.js");
var api = require("./request/api")

module.exports = {
    createEmbed: function(title, avatar = true) {
        var embed = new EmbedBuilder();

        if (avatar)
            embed.setThumbnail(index.bot.user.avatarURL());

        embed.setTimestamp();
        embed.setFooter({ text: 'Queue Bot by ziue' })
        embed.setImage('https://cdn.discordapp.com/attachments/943936010016944168/1043935002573942854/standard_3.gif');
        embed.setColor(index.config.guild.embedColour);
        embed.setTitle(`${title}`);

        return embed;
    },

    claimPing: function(type, delay, userid) {
        // i kept it simple: https://discord.com/developers/docs/resources/user#user-object-premium-types
        // 0 = None, 1 = Nitro Classic, 2 = Nitro, 3 = Nitro Basic
        var typeIdx = type.includes("Nitro") ? (type.includes("Classic") ? 1 : type.includes("Basic") ? 3 : 2) : 0;

        // should never happen in this case!
        if (typeIdx == 0)
            return;

        // to make this look better we should put it in config directly
        var nitroEmojiList = [
            "",
            index.config.guild.publicSnipes.classicNitroEmoji,
            index.config.guild.publicSnipes.boostNitroEmoji,
            index.config.guild.publicSnipes.basicNitroEmoji
        ];

        var nitroEmoji = nitroEmojiList[typeIdx];

        // todo: stop checking cache, but fetch ~snek
        let claimRole = index.bot.guilds.cache.get(index.config.guild.id).roles.cache.find(role => role.name === index.config.guild.publicSnipes.roleName);

        switch (index.config.guild.publicSnipes.messageStyle) {
            case 1: { // Embed
                var embed = this.createEmbed("Successful Snipe", false);
                embed.addFields({ name: "Type", value: `\`${type}\``, inline: true });
                embed.addFields({ name: "Delay", value: `\`${delay}\``, inline: true });
                if (userid) {
                    embed.addFields({ name: "User", value: `<@${userid}>`, inline: true });
                }

                var content = "";
                if (claimRole != undefined) {
                    content += `<@&${claimRole.id}>`;
                }

                if (userid) {
                    if (content.length > 0) content += " ";
                    content += `<@${userid}>`
                }

                if (nitroEmoji.length > 0) {
                    if (content.length > 0) content += " ";
                    content += nitroEmoji;
                }

                index.bot.channels.fetch(index.config.guild.publicSnipes.channelId).then((channel) => {
                    channel.send({ content: content, embeds: [embed] }).then((message) => {
                        
                    }).catch((error) => {
                        var logEmbed = createEmbed("Failed to send public claim message");
                        logEmbed.setDescription(":x: | Failed sending message");
                        logEmbed.addFields({name: "Error", value: `${error}`});
                        logToChannel({embeds: [logEmbed]});
                    })
                }).catch((error) => {
                    var logEmbed = createEmbed("Failed to send public claim message");
                    logEmbed.setDescription(":x: | Failed to find the public claims channel");
                    logEmbed.addFields({name: "Error", value: `${error}`});
                    logToChannel({embeds: [logEmbed]});
                })
                break;
            }
            default: {
                var content = "";
                if (nitroEmoji.length > 0) {
                    content += nitroEmoji + " ";
                }

                content += `Successfully claimed \`${type}\` in \`${delay}\``;

                if (userid) {
                    content += ` for <@${userid}>`
                }

                if (claimRole != undefined) {
                    content += ` <@&${claimRole.id}>`;
                }

                index.bot.channels.fetch(index.config.guild.publicSnipes.channelId).then((channel) => {
                    channel.send(content).then((message) => {
                        
                    }).catch((error) => {
                        var logEmbed = createEmbed("Failed to send public claim message");
                        logEmbed.setDescription(":x: | Failed sending message");
                        logEmbed.addFields({name: "Error", value: `${error}`});
                        logToChannel({embeds: [logEmbed]});
                    })
                }).catch((error) => {
                    var logEmbed = createEmbed("Failed to send public claim message");
                    logEmbed.setDescription(":x: | Failed to find the public claims channel");
                    logEmbed.addFields({name: "Error", value: `${error}`});
                    logToChannel({embeds: [logEmbed]});
                })
            }
        }
    },

    LOG: function(queue) {
        // ignore how this was done ~snek
        index.bot.guilds.fetch(index.config.guild.id).then(guild => {
            guild.channels.fetch(index.config.guild.queueEmbed.channelId).then(channel => {
                channel.messages.fetch(index.config.guild.queueEmbed.messageId).then(message => {
                    var currentQueue = "";
        
                    if (queue.length <= 0)
                        currentQueue = "No one in queue.";

                    for (var i = 0; i < queue.length; i++) {
                        let emoji = ""
                        if (i == 0) {
                            if (index.config.guild.queueEmbed.progressEmoji.length > 0) {
                                emoji += ` ${index.config.guild.queueEmbed.progressEmoji}`
                            }
                        }
                        else if (i == 1) {
                            if (index.config.guild.queueEmbed.waitingEmoji.length > 0) {
                                emoji += ` ${index.config.guild.queueEmbed.waitingEmoji}`
                            }
                        }

                        currentQueue += `> ${i + 1} | **${queue[i].username}** \`\`${queue[i].currentClaimAmount}/${queue[i].totalClaimAmount}\`\`` + emoji + "\n";
                    }
            
                    var embed = this.createEmbed("Queue", false);
                    embed.setDescription(currentQueue);
                    message.edit({ content: "", embeds: [embed] });
                    console.log("[LOG] Edited message");
                }).catch(error => {
                    console.log(`[LOG] Error finding/editing message: ${error}`);
                })
            }).catch(error => {
                console.log(`[LOG] Error fetching channel: ${error}`);
            })
        }).catch(error => {
            console.log(`[LOG] Error fetching guild: ${error}`);
        })
    },

    logToChannel: async function(message_data) {
        // get guild
        let guild = index.bot.guilds.cache.get(index.config.guild.id);

        if (guild == undefined)
            return {success: false, error: "Guild not found"};
    
        // get channel
        let channel = guild.channels.cache.get(index.config.guild.logChannel);

        if (channel == undefined)
            return {success: false, error: "Channel not found"};
        
        try {
            let message = await channel.send(message_data)
            return {success: true, message: message};
        }
        catch(error) {
            return {success: false, error: error};
        }
    },

    getStats: async function(interaction) {
        async function GetStatsMessage() {
            let guild = await index.bot.guilds.fetch(index.config.guild.id).catch(error => {});
            if (guild == undefined)
                return undefined;

            let channel = await guild.channels.fetch(index.config.stats.public.channelId).catch(error => {});
            if (channel == undefined)
                return undefined;

            let message = await channel.messages.fetch(index.config.stats.public.messageId).catch(error => {});
            return message;
        }

        let statsMessage = await GetStatsMessage();

        var embed = this.createEmbed("Stats", false)
        embed.setDescription("Stats should show in a few if there are any..");

        var checkedMessages = 0;
        var invitesDetected = 0;
        var snipedNitros = 0;
        var detectedNitros = 0;

        api.getStats(function (ret) {
            if (!ret.ok) {
                embed.addFields({name: "Error", value: ret.message, inline: true});
                if (interaction)
                    interaction.editReply({embeds: [embed]});
                
                if (statsMessage)
                    statsMessage.edit({content: "", embeds: [embed]})

                return;
            }

            checkedMessages += ret.data.checkedMessages;
            invitesDetected += ret.data.invitesDetected;
            snipedNitros += ret.data.snipedNitros;
            detectedNitros += ret.data.detectedNitros;

            // https://stackoverflow.com/questions/2901102/how-to-format-a-number-with-commas-as-thousands-separators
            // put this somewhere else please
            function numberWithCommas(x) {
                return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            }

            var checkedMessagesStr = numberWithCommas(checkedMessages);
            var invitesDetectedStr = numberWithCommas(invitesDetected);
            var snipedNitrosStr = numberWithCommas(snipedNitros);

            embed.setDescription(`We have checked a total of \`\`${checkedMessagesStr}\`\` messages & \`\`${invitesDetectedStr}\`\` of them are invites.\n\nWe have sniped a total of \`\`${snipedNitrosStr}\`\` nitro codes!`);
            
            if (interaction)
                interaction.editReply({embeds: [embed]});
                
            if (statsMessage)
                statsMessage.edit({content: "", embeds: [embed]})
        });
    },

    success: function(success, message) {
        var embed = this.createEmbed("Command completed", false);
        embed.setDescription(`:white_check_mark: | ${success}`);
        return message.channel.send({ embeds: [embed] });
    },

    successEdit: function(success, message) {
        const embed = this.createEmbed("Command completed", false);
        embed.setDescription(`:white_check_mark: | ${success}`);
        return message.edit({ embeds: [embed] });
    },

    successReply: async function(success, interaction) {
        var embed = this.createEmbed("Command completed", false);
        embed.setDescription(`:white_check_mark: | ${success}`);
        await interaction.reply({ ephemeral: true, embeds: [embed] });
    },

    error: function(error, message) {
        var embed = this.createEmbed("Error on command", false);
        embed.setDescription(`:x: | ${error}`);
        message.channel.send({ embeds: [embed] });
    },

    errorEdit: function(error, message) {
        const embed = this.createEmbed("Error on command", false);
        embed.setDescription(`:x: | ${error}`);
        return message.edit({ embeds: [embed] });
    },

    errorReply: async function(error, interaction) {
        var embed = this.createEmbed("Error on command", false);
        embed.setDescription(`:x: | ${error}`);
        await interaction.reply({ ephemeral: true, embeds: [embed] });
    },

    parameters: function(command, message) {
        this.error(`Missing parameter(s), use \`/help ${command}\`.`, message);
    },

    isOwner: function(uid) {
        return index.config.bot.owners.indexOf(uid) > -1;
    },

    capitalizeFirstLetter: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    sendHelp: function(categories, commands, interaction) {
        var commandsCount = 0;
        var embed = new EmbedBuilder();

        embed.setTimestamp();
        embed.setColor(index.config.guild.embedColour);
        embed.setTitle(`${index.bot.user.username} - Help`);
        embed.setDescription(`Below is a list of all my commands, to see more about a command or how to use it simply issue \`/help <command name>\` and you'll see its usage.`);

        for (var i = 0; i < categories.length; i++) {
            switch (categories[i].toLowerCase()) {
                case "!owner":
                    {
                        if (this.isOwner(interaction.author.id)) {
                            embed.addFields({ name: `Owner commands (${commands[i].split(", ").length})`, value: commands[i] });
                            commandsCount += commands[i].split(", ").length;
                        }
                    }
                    break;
                default:
                    {
                        embed.addFields({ name: `${categories[i]} commands (${commands[i].split(", ").length})`, value: commands[i] });
                        commandsCount += commands[i].split(", ").length;
                    }
                    break;
            }
        }

        embed.setDescription(`Below is a list of all my commands (${commandsCount} total), to see more about a command or how to use it simply issue \`/help <command name>\` and you'll see its usage.`);

        interaction.reply({embeds: [embed], ephemeral: false});
    }
}