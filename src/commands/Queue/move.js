exports.run = (bot, interaction, suffix, help) => {
    const utility = require("../../modules/utility.js");
    const queue = require("../../modules/databases/queue")
    const queueHandler = require("../../modules/queue/utility/queueHandler.js");

    if (!utility.isOwner(interaction.user.id))
        return utility.errorReply("This command is for the bot owner only.", interaction);

    if (help) {
        var embed = utility.createEmbed("move");
        embed.setDescription("More details for the **move** command.");
        embed.addFields({ name: "Command usage", value: "/move <position> <new_position>" });
        embed.addFields({ name: "Description", value: "Move an order from a position to another." });
        return interaction.reply({embeds: [embed], ephemeral: false})
    }

    var position = interaction.options.getInteger("position");
    var newPosition = interaction.options.getInteger("new_position");

    let success = queue.moveData(position, newPosition);

    if (success) {
        utility.successReply(`Successfully moved order number ${position} > ${newPosition}`, interaction);
        utility.LOG(queue.getCurrentQueue());

        queueHandler.checkQueue();
    } else {
        utility.errorReply("Failed to move order", interaction);
    }
};