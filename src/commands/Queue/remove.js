exports.run = (bot, interaction, suffix, help) => {
    const utility = require("../../modules/utility.js");
    const queue = require("../../modules/databases/queue")
    const queueHandler = require("../../modules/queue/utility/queueHandler.js");

    if (!utility.isOwner(interaction.user.id))
        return utility.errorReply("This command is for the bot owner only.", interaction);

    if (help) {
        var embed = utility.createEmbed("remove");
        embed.setDescription("More details for the **remove** command.");
        embed.addFields({ name: "Command usage", value: "/remove <position>" });
        embed.addFields({ name: "Description", value: "Remove an order from queue." });
        return interaction.reply({embeds: [embed], ephemeral: false})
    }

    var position = interaction.options.getInteger("position");
    let success = queue.removeData(position);
    
    if (success) {
        utility.successReply("Successfully removed order.", interaction);
        utility.LOG(queue.getCurrentQueue())
    }
    else
        utility.errorReply("Failed to move order", interaction);

    queueHandler.checkQueue();
};