exports.run = (bot, interaction, suffix, help) => {
    const utility = require("../../modules/utility.js");
    const keys = require("../../modules/databases/keys");

    if (!utility.isOwner(interaction.user.id))
        return utility.errorReply("This command is for the bot owner only.", interaction);

    if (help) {
        var embed = utility.createEmbed("Key");
        embed.setDescription("More details for the **key** command.");
        embed.addFields({ name: "Command usage", value: "/key <claims> <user>" });
        embed.addFields({ name: "Description", value: "Generate a key and send to user" });
        return interaction.reply({ ephemeral: true, embeds: [embed] })
    }

    var claims = interaction.options.getInteger("claims");
    var user = interaction.options.getUser("user");

    let generatedKey = keys.addKey(claims);

    var embed = utility.createEmbed("You have generated a new key");
    embed.addFields(
        { 
            name: "Key", 
            value: `\`${generatedKey}\`` 
        },
        { 
            name: "Claims", 
            value: `\`${claims}\`` 
        }
    );

    var embedDM = utility.createEmbed(`${interaction.user.username} has generated you a key!`);
    embedDM.addFields(
        { 
            name: "Key", 
            value: `\`${generatedKey}\`` 
        },
        { 
            name: "Claims", 
            value: `\`${claims}\`` 
        }
    );

    user.send({embeds: [embedDM] }).catch((err) => {})
    interaction.reply({ ephemeral: true, embeds: [embed] });
};