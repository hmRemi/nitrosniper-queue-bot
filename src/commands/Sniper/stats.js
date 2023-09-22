exports.run = (bot, interaction, suffix, help) => {
    const utility = require("../../modules/utility.js");
    const api = require("../../modules/request/api")

    if (!utility.isOwner(interaction.user.id))
        return utility.errorReply("This command is for the bot owner only.", interaction);

    if (help) {
        var embed = utility.createEmbed("Stats");
        embed.setDescription("More details for the **stats** command.");
        embed.addFields({ name: "Command usage", value: "This command takes no parameters." });
        embed.addFields({ name: "Description", value: "Get/Update sniper stats." });
        return interaction.reply({embeds: [embed], ephemeral: true})
    }

    var embed = utility.createEmbed("Stats")
    embed.setDescription("Stats should show in a few if there are any..");
    interaction.reply({embeds: [embed], ephemeral: true}).then(function (v) {
        utility.getStats(interaction); 
    });
};