exports.run = (bot, interaction, suffix, help) => {
    const utility = require("../../modules/utility.js");
    const queue = require("../../modules/databases/queue.js");

    if (!utility.isOwner(interaction.user.id))
        return utility.errorReply("This command is for the bot owner only.", interaction);

    if (help) {
        var embed = utility.createEmbed("Queue Update");
        embed.setDescription("More details for the **update_queue** command.");
        embed.addFields({ name: "Command usage", value: "This command takes no parameters." });
        embed.addFields({ name: "Description", value: "Update queue embed with latest queue data." });
        return interaction.reply({embeds: [embed], ephemeral: false})
    }

    var embed = utility.createEmbed("Updating queue...")
    embed.setDescription("If you see no updates in the next minute, please check console window for information.")

    interaction.reply({embeds: [embed], ephemeral: false}).catch(error => {
        console.log(error)
    });

    utility.LOG(queue.getCurrentQueue())
};