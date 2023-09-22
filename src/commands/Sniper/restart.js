exports.run = (bot, interaction, suffix, help) => {
    const utility = require("../../modules/utility.js");
    const queueHandler = require("../../modules/queue/utility/queueHandler")

    if (!utility.isOwner(interaction.user.id))
        return utility.errorReply("This command is for the bot owner only.", interaction);

    if (help) {
        var embed = utility.createEmbed("Restart snipers");
        embed.setDescription("More details for the **restart** command.");
        embed.addFields({ name: "Command usage", value: "This command takes no parameters." });
        embed.addFields({ name: "Description", value: "Restart snipers." });
        return interaction.reply({embeds: [embed], ephemeral: false})
    }

    queueHandler.checkQueue();

    var embed = utility.createEmbed("Restart snipers")
    embed.setDescription("Snipers will be restarted right about now..");

    interaction.reply({embeds: [embed], ephemeral: false}).then(() => {
        utility.logToChannel({embeds: [embed]}).then((ret) => {
            queueHandler.restartSnipers(interaction, ret.message)
        })
    }).catch(error => {
        console.log(error);

        var logEmbed = utility.createEmbed("Failed to restart snipers")
        logEmbed.setDescription(":x: | Failed to restart snipers, please check console for more details.")
        utility.logToChannel({embeds: [logEmbed]})
    });
};