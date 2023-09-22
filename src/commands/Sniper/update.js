exports.run = (bot, interaction, suffix, help) => {
    const utility = require("../../modules/utility.js");
    const queueHandler = require("../../modules/queue/utility/queueHandler")

    if (!utility.isOwner(interaction.user.id))
        return utility.errorReply("This command is for the bot owner only.", interaction);

    if (help) {
        var embed = utility.createEmbed("Update snipers");
        embed.setDescription("More details for the **restart** command.");
        embed.addFields({ name: "Command usage", value: "This command takes no parameters." });
        embed.addFields({ name: "Description", value: "Update and restart snipers." });
        return interaction.reply({embeds: [embed], ephemeral: true})
    }

    var embed = utility.createEmbed("Update snipers")
    embed.setDescription("Snipers will be updated right about now..");

    interaction.reply({embeds: [embed], ephemeral: true}).then(() => {
        utility.logToChannel({embeds: [embed]}).then((ret) => {
            queueHandler.updateSnipers(interaction, ret.message)
        })
    }).catch(error => {
        console.log(error);

        var logEmbed = utility.createEmbed("Failed to update snipers")
        logEmbed.setDescription(":x: | Failed to update snipers, please check console for more details.")
        utility.logToChannel({embeds: [logEmbed]})
    });
};