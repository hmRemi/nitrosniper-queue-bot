exports.run = (bot, interaction, suffix, help) => {
    const utility = require("../../modules/utility.js");
    const keys = require("../../modules/databases/keys");

    if (!utility.isOwner(interaction.user.id))
        return utility.errorReply("This command is for the bot owner only.", interaction);

    if (help) {
        var embed = utility.createEmbed("Get Keys");
        embed.setDescription("More details for the **get keys** command.");
        embed.addFields({ name: "Command usage", value: "/get-keys" });
        embed.addFields({ name: "Description", value: "Get all keys from JSON." });
        return interaction.reply({ ephemeral: true, embeds: [embed] })
    }

    let keyList = keys.getCurrentKeys();

    var embed = utility.createEmbed("You have generated a new key");
    embed.addFields(
        { 
            name: "Keys", 
            value: `\`${JSON.stringify(keyList)}\`` 
        }
    );

    interaction.reply({ ephemeral: true, embeds: [embed] });
};