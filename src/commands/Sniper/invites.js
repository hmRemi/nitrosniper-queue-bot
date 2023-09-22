exports.run = (bot, interaction, suffix, help) => {
    const utility = require("../../modules/utility.js");
    const queueHandler = require("../../modules/queue/utility/queueHandler")

    if (!utility.isOwner(interaction.user.id))
        return utility.errorReply("This command is for the bot owner only.", interaction);

    if (help) {
        var embed = utility.createEmbed("Invites");
        embed.setDescription("More details for the **invites** command.");
        embed.addFields({ name: "Command usage", value: "This command takes no parameters." });
        embed.addFields({ name: "Description", value: "Get invite codes scraped by snipers." });
        return interaction.reply({embeds: [embed], ephemeral: true})
    }

    var shouldDelete = interaction.options.getBoolean("delete") ?? false;

    var embed = utility.createEmbed("Invites")
    //embed.setDescription("Uploading invites scraped..");
    embed.setDescription("Not implemented yet..");

    interaction.reply({embeds: [embed], ephemeral: true}).then(() => {
        queueHandler.grabScrapedInvites(shouldDelete);
    }).catch(error => {
        console.log(error);

        var logEmbed = utility.createEmbed("Failed to upload invites")
        logEmbed.setDescription(":x: | Failed to upload invites, please check console for more details.")
        utility.logToChannel({embeds: [logEmbed]})
    });
};