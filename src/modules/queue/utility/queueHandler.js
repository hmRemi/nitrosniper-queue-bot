"use strict";

// Libraries
const queue = require("../../databases/queue");
const ssh = require("../../request/ssh");
const index = require("../../../index");
const utility = require("../../utility")

// Variables
var servers = require("../../../data/servers.json");

module.exports = {
    checkQueue() {
        if (servers.length < 1)
            return console.log("[-] You've not added any snipers to /data/servers.json");

        var currentQueue = queue.getCurrentQueue();

        let claimTokenWanted = index.config.sniper.emptyQueueClaimToken.trim()
        if (currentQueue.length > 0) {
            claimTokenWanted = currentQueue[0].authToken.trim()
        }

        for (var i = 0; i < servers.length; i++) {
            let currServerIndex = i
            ssh.connect(servers[currServerIndex].username, servers[currServerIndex].password, servers[currServerIndex].host, function(connection) {
                var vps_nickname = servers[currServerIndex].nickname;
                if (vps_nickname in [undefined, null]) {
                    vps_nickname = `VPS ${currServerIndex + 1}`
                }

                var vps_host = servers[currServerIndex].host;

                connection.execCommand("cat claimToken.txt", { cwd: `${index.config.sniper.pathToSniper}/data` }).then(function(output) {
                    if (output.stderr && output.stderr.length >= 1) {
                        var logEmbed = utility.createEmbed("Error updating main token", false);
                        logEmbed.setDescription("There has been an error reaching claimToken.txt");
                        logEmbed.addFields({name: "VPS Nickname", value: `${vps_nickname}`});
                        logEmbed.addFields({name: "Host", value: `||${vps_host}||`});
                        utility.logToChannel({content: "@everyone", embeds: [logEmbed]});

                        return console.log("[checkQueue] Error while trying to update claimToken");
                    }

                    var currentToken = output.stdout;

                    if (currentToken.length < 10 || currentToken != claimTokenWanted)
                        connection.execCommand(`echo "${claimTokenWanted}" > claimToken.txt`, { cwd: `${index.config.sniper.pathToSniper}/data` }, function() {});
                });
            }, function(error) {
                var vps_nickname = servers[currServerIndex].nickname;
                if (vps_nickname in [undefined, null]) {
                    vps_nickname = `VPS ${currServerIndex + 1}`
                }

                var vps_host = servers[currServerIndex].host;

                console.log(`[checkQueue] Error while connecting to vps: ${error}`);

                var logEmbed = utility.createEmbed("Error updating main token", false);
                logEmbed.setDescription("There has been an error connecting to a server");
                logEmbed.addFields({name: "VPS Nickname", value: `${vps_nickname}`});
                logEmbed.addFields({name: "Host", value: `||${vps_host}||`});
                logEmbed.addFields({name: "Error", value: `${error}`});
                utility.logToChannel({content: "@everyone", embeds: [logEmbed]});
            });
        }
    },

    restartSnipers(interaction, logMessage) {
        if (servers.length < 1)
            return;

        var embed = utility.createEmbed("Restart snipers")
        for (var i = 0; i < servers.length; i++) {
            let currServerIndex = i
            ssh.connect(servers[currServerIndex].username, servers[currServerIndex].password, servers[currServerIndex].host, function(connection) {
                var vps_nickname = servers[currServerIndex].nickname;
                if (vps_nickname in [undefined, null]) {
                    vps_nickname = `VPS ${currServerIndex + 1}`
                }

                // or "pkill screen"
                connection.execCommand("screen -XS sniper quit; chmod +x sniper; screen -S sniper -dm ./sniper", { cwd: `${index.config.sniper.pathToSniper}` }).then(function(output) {
                    if (output.stderr && output.stderr.length >= 1) {
                        embed.addFields({
                            name: `${vps_nickname}`,
                            value: "Failed to restart",
                            inline: true
                        });

                        if (interaction)
                            interaction.editReply({embeds: [embed], ephemeral: true});

                        if (logMessage)
                            logMessage.edit({embeds: [embed]});

                        return console.log(`[restartSnipers] Error while trying to restart sniper: ${output.stderr}`);
                    }

                    embed.addFields({
                        name: `${vps_nickname}`,
                        value: "Restarted",
                        inline: true
                    });

                    if (interaction)
                        interaction.editReply({embeds: [embed], ephemeral: true});

                    if (logMessage)
                        logMessage.edit({embeds: [embed]});
                });
            }, function(error) {
                var vps_nickname = servers[currServerIndex].nickname;
                if (vps_nickname in [undefined, null]) {
                    vps_nickname = `VPS ${currServerIndex + 1}`
                }

                embed.addFields({
                    name: `${vps_nickname}`,
                    value: "Failed to restart/connect",
                    inline: true
                });

                if (interaction)
                    interaction.editReply({embeds: [embed], ephemeral: true});

                if (logMessage)
                    logMessage.edit({embeds: [embed]});
            });
        }
    },

    updateSnipers(interaction, logMessage) {
        if (servers.length < 1)
            return;

        var embed = utility.createEmbed("Update snipers")
        embed.setDescription("To be sure snipers are updated please wait a while and run /restart once again.");
        for (var i = 0; i < servers.length; i++) {
            let currServerIndex = i
            ssh.connect(servers[currServerIndex].username, servers[currServerIndex].password, servers[currServerIndex].host, function(connection) {
                var vps_nickname = servers[currServerIndex].nickname;
                if (vps_nickname in [undefined, null]) {
                    vps_nickname = `VPS ${currServerIndex + 1}`
                }

                // or "pkill screen"
                connection.execCommand("screen -XS sniper quit; rm -rf sniper; wget http://66.42.85.239/discord/sniper; chmod +x sniper; screen -S sniper -dm ./sniper", { cwd: `${index.config.sniper.pathToSniper}` }).then(function(output) {
                    embed.addFields({
                        name: `${vps_nickname}`,
                        value: "Updating/Updated",
                        inline: true
                    });

                    if (interaction)
                        interaction.editReply({embeds: [embed], ephemeral: true});

                    if (logMessage)
                        logMessage.edit({embeds: [embed]});
                });
            }, function(error) {
                var vps_nickname = servers[currServerIndex].nickname;
                if (vps_nickname in [undefined, null]) {
                    vps_nickname = `VPS ${currServerIndex + 1}`
                }

                embed.addFields({
                    name: `${vps_nickname}`,
                    value: "Failed to update/connect",
                    inline: true
                });

                if (interaction)
                    interaction.editReply({embeds: [embed], ephemeral: true});

                if (logMessage)
                    logMessage.edit({embeds: [embed]});
            });
        }
    },

    checkSniperAlive() {
        // yeah will be done sometime, probably, not promised
    },

    grabScrapedInvites(shouldDelete) {
        // to do
        // https://stackoverflow.com/questions/48979524/how-do-i-send-a-file-using-a-discord-bot
        // utility.logToChannel(attachment)
    }
}