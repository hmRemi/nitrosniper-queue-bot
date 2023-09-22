exports.run = (bot, interaction, suffix, help) => {
    const utility = require("../../modules/utility.js");
    const queue = require("../../modules/databases/queue.js");
    const queueHandler = require("../../modules/queue/utility/queueHandler.js");

    if (!utility.isOwner(interaction.user.id))
        return utility.errorReply("This command is for the bot owner only.", interaction);

    if (help) {
        var embed = utility.createEmbed("Update token");
        embed.setDescription("More details for the **update_token** command.");
        embed.addFields({ name: "Command usage", value: "This command takes no parameters." });
        embed.addFields({ name: "Description", value: "Update main token in snipers." });
        return interaction.reply({embeds: [embed], ephemeral: false})
    }

    queueHandler.checkQueue();

    var embed = utility.createEmbed("Updating Claim Token")
    embed.setDescription("If the bot failed to automatically update the claim token this will force it to update.");

    interaction.reply({embeds: [embed], ephemeral: false}).catch(error => {
        console.log(error);
    });
};