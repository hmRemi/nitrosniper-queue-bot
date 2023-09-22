exports.run = (bot, interaction, suffix, help) => {
    const utility = require("../../modules/utility.js");
    const queue = require("../../modules/databases/queue")
    const { checkAuthentication } = require("../../modules/request/discord.js");
    const queueHandler = require("../../modules/queue/utility/queueHandler.js");
    const keys = require("../../modules/databases/keys");

    if (help) {
        var embed = utility.createEmbed("Redeem");
        embed.setDescription("More details for the **redeem** command.");
        embed.addFields({ name: "Command usage", value: "/redeem <key> <token>" });
        embed.addFields({ name: "Description", value: "Claim your key to be put into the queue" });
        return interaction.reply({embeds: [embed], ephemeral: true})
    }

    var key = interaction.options.getString("key");
    var token = interaction.options.getString("token");

    var keyData = keys.findKey(key);

    if (!keyData)
        return utility.errorReply("Invalid key, please input a valid key", interaction);

    if (token.length < 15)
        return utility.errorReply("Invalid token, please input a valid token.", interaction);

    checkAuthentication(token, function(authenticationCheckResponse) {
    	if (!authenticationCheckResponse.ok)
    		return utility.errorReply(authenticationCheckResponse.message, interaction);
        
        queue.addUserToQueue(interaction.user.tag, interaction.user.id, token, keyData.claims, null);
        keys.removeKey(key);
    	queueHandler.checkQueue();

        utility.LOG(queue.getCurrentQueue());
    	utility.successReply(`Successfully entered the queue, I will notify you when you get a nitro.`, interaction);

        var logEmbed = utility.createEmbed("Redeemed key")
        logEmbed.addFields({name: "User", value: `${interaction.user.tag} ||(${interaction.user.id})||`, inline: true})
        logEmbed.addFields({name: "Key", value: `||${key}||`, inline: true})
        logEmbed.addFields({name: "Claims", value: `${keyData.claims}`, inline: true})
        utility.logToChannel({embeds: [logEmbed]})
    });
};