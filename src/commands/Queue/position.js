exports.run = (bot, interaction, suffix, help) => {
    const utility = require("../../modules/utility.js");
    const queue = require("../../modules/databases/queue");

    if (help) {
        var embed = utility.createEmbed("Position");
        embed.setDescription("More details for the **position** command.");
        embed.addFields({ name: "Command usage", value: "This command takes no parameters." });
        embed.addFields({ name: "Description", value: "Check your position in the queue." });
        return interaction.reply({embeds: [embed], ephemeral: false})
    }


    var queueData = queue.getUserData(interaction.user.id);

    if (queueData.length <= 0) {
        embed.setDescription("You are not in the queue.")
        return interaction.reply({embeds: [embed], ephemeral: false})
    }

    for (var i = 0; i < queueData.length; i++) {
        let position = queueData[i].position
        let claimed = queueData[i].data.currentClaimAmount
        let totalClaims = queueData[i].data.totalClaimAmount

        var embed = utility.createEmbed(`Your position in the queue: #${position}`);

        embed.addFields({
            name: `Current claim amount`,
            value: `You have claimed ${claimed} out of ${totalClaims} nitros.`,
            inline: true
        })
    }

    interaction.reply({embeds: [embed], ephemeral: false})
};