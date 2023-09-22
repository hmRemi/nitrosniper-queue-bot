const { config } = require("../index");

module.exports = (bot, message) => {
	const utility = require("../modules/utility");
    const index = require("../index");

    const queue = require("../modules/databases/queue");
    const queueHandler = require("../modules/queue/utility/queueHandler");
    const keys = require("../modules/databases/keys");

    if (message.channel.type == 0 && message.guild.id == index.config.guild.id && message.channel.id == index.config.sniper.webhooks.successfulChannelId && message.embeds.length == 1 && message.embeds[0].fields.length >= 2 && message.embeds[0].description.includes(":white_check_mark:")) {
        var currentQueue = queue.getCurrentQueue();
        var claimerDiscordId = undefined;
        if (currentQueue.length > 0) {
            var topQueueUser = currentQueue[0];
            topQueueUser.currentClaimAmount += 1;

            if (index.config.guild.publicSnipes.mentionUser) {
                claimerDiscordId = topQueueUser.discordId;
            }

            if (topQueueUser.currentClaimAmount >= topQueueUser.totalClaimAmount) {
                queue.removeData(1);
                queueHandler.checkQueue();

                var orderCompleteEmbed = utility.createEmbed("Order complete");
        	    orderCompleteEmbed.setDescription(`This is your last claim. Thank you for being with us! If you wish to buy more, please make a ticket in our server.`);
                orderCompleteEmbed.addFields({name: "Claims", value: `${topQueueUser.currentClaimAmount}/${topQueueUser.totalClaimAmount}`})

                // Logging to channel after sending message to user.
                bot.users.fetch(topQueueUser.discordId).then(user => {
                    user.send({embeds: [orderCompleteEmbed]})
                    .then((message) => {
                        var logEmbed = utility.createEmbed("Order completed");
                        logEmbed.setDescription("Order completed. Sent order info successfully to user.");
                        logEmbed.addFields({name: "User", value: `<@${topQueueUser.discordId}> ||(${topQueueUser.discordId})||`});
                        logEmbed.addFields({name: "Claims", value: `${topQueueUser.totalClaimAmount}`});
                        utility.logToChannel({embeds: [logEmbed]});
                    }).catch((error) => {
                        var logEmbed = utility.createEmbed("Order completed | Failed to send DM");
                        logEmbed.setDescription(":x: | Failed to send DM to notify user about order completed.");
                        logEmbed.addFields({name: "User", value: `<@${topQueueUser.discordId}> ||(${topQueueUser.discordId})||`});
                        logEmbed.addFields({name: "Claims", value: `${topQueueUser.totalClaimAmount}`});
                        logEmbed.addFields({name: "Error", value: `${error}`});
                        utility.logToChannel({embeds: [logEmbed]});
                    })
                }).catch((error) => {
                    var logEmbed = utility.createEmbed("Order completed | Failed to send DM");
                    logEmbed.setDescription(":x: | Failed to send DM to notify user about order completed. (on user fetch)");
                    logEmbed.addFields({name: "User", value: `<@${topQueueUser.discordId}> ||(${topQueueUser.discordId})||`});
                    logEmbed.addFields({name: "Claims", value: `${topQueueUser.totalClaimAmount}`});
                    logEmbed.addFields({name: "Error", value: `${error}`});
                    utility.logToChannel({embeds: [logEmbed]});
                })       	    
            } else {
        	    queue.onUserNewClaim(topQueueUser.authToken, 1);
                
                var nitroSniped = utility.createEmbed("Sniped Nitro!");
                nitroSniped.setDescription(`Succesfully claimed another nitro!. ${message.embeds[0].fields[2].value} has been credited to your account`);
                nitroSniped.addFields({name: "Claims", value: `${topQueueUser.currentClaimAmount}/${topQueueUser.totalClaimAmount}`})

                bot.users.fetch(topQueueUser.discordId).then(user => {
                    user.send({ embeds: [nitroSniped] })
                    .then((message) => {
                        // Empty
                    }).catch((error) => {
                        var logEmbed = utility.createEmbed("Failed to send DM");
                        logEmbed.setDescription(":x: | Failed to send DM to notify user about new claim.");
                        logEmbed.addFields({name: "User", value: `<@${topQueueUser.discordId}> ||(${topQueueUser.discordId})||`});
                        logEmbed.addFields({name: "Error", value: `${error}`});
                        utility.logToChannel({embeds: [logEmbed]});
                    })
                }).catch((error) => {
                    var logEmbed = utility.createEmbed("Failed to send DM");
                    logEmbed.setDescription(":x: | Failed to send DM to notify user about new claim. (on user fetch)");
                    logEmbed.addFields({name: "User", value: `<@${topQueueUser.discordId}> ||(${topQueueUser.discordId})||`});
                    logEmbed.addFields({name: "Error", value: `${error}`});
                    utility.logToChannel({embeds: [logEmbed]});
                })

                if (config.misc.rotateQueue) {
                    let newPosition = queue.getCurrentQueue().length
                    if (newPosition > 1) {
                        queue.moveData(1, newPosition)
        	            queueHandler.checkQueue();
                    }
                }
            }
        }

        utility.LOG(queue.getCurrentQueue())
        utility.claimPing(message.embeds[0].fields[2].value, message.embeds[0].fields[1].value, claimerDiscordId);
    }

    if (message.channel.type == 0 && message.guild.id == index.config.guild.id && message.channel.id == index.config.sniper.webhooks.missedChannelId && message.embeds.length == 1 && message.embeds[0].fields.length >= 5 && message.embeds[0].description.includes(":x:")) {  
        if (message.embeds[0].fields[6].value.includes("401: Unauthorized")) {
            var currentQueue = queue.getCurrentQueue()
            if (currentQueue.length > 0) {
                var topQueueUser = currentQueue[0];
                var leftClaims = topQueueUser.totalClaimAmount - topQueueUser.currentClaimAmount;

                var invalidToken = utility.createEmbed("Invalid Token");
                invalidToken.setDescription("Your token has become unauthorised, meaning it has been changed for some reason");

                bot.users.fetch(topQueueUser.discordId).then((user) => {
                    user.send({embeds: [invalidToken]}).then((message) => {
                        var newKey = config.misc.automaticallyRefundInvalidAccount ? keys.addKey(leftClaims) : null
                        
                        invalidToken.addFields({name: "New Key", value: `${newKey}`});
                        invalidToken.addFields({name: "Claims Left", value: `${leftClaims}`});

                        if (newKey != null)
                            message.edit({embeds: [invalidToken]})

                        var logEmbed = utility.createEmbed("Invalid token");
                        logEmbed.setDescription("User has an invalid token.");
                        logEmbed.addFields({name: "User", value: `<@${topQueueUser.discordId}> ||(${topQueueUser.discordId})||`});
                        logEmbed.addFields({name: "Claims Left", value: `${leftClaims}`});
                        if (newKey != null)
                            logEmbed.addFields({name: "Refund Key", value: `\`${newKey}\``});

                        utility.logToChannel({embeds: [logEmbed]});
                    }).catch(error => {
                        var logEmbed = utility.createEmbed("Invalid token");
                        logEmbed.setDescription(":x: | User has an invalid token. Failed to send direct message to user");
                        logEmbed.addFields({name: "User", value: `<@${topQueueUser.discordId}> ||(${topQueueUser.discordId})||`});
                        logEmbed.addFields({name: "Claims Left", value: `${leftClaims}`});
                        logEmbed.addFields({name: "Error", value: `${error}`});
                        utility.logToChannel({embeds: [logEmbed]});
                    });
                }).catch((error) => {
                    var logEmbed = utility.createEmbed("Invalid token");
                    logEmbed.setDescription(":x: | User has an invalid token. Failed to send direct message to user.");
                    logEmbed.addFields({name: "User", value: `<@${topQueueUser.discordId}> ||(${topQueueUser.discordId})||`});
                    logEmbed.addFields({name: "Claims Left", value: `${leftClaims}`});
                    logEmbed.addFields({name: "Error", value: `${error}`});
                    utility.logToChannel({embeds: [logEmbed]});
                })
            
                queue.removeData(1);
                queueHandler.checkQueue();
                utility.LOG(queue.getCurrentQueue())
            }
        }
    }
};