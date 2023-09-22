const { successEdit } = require("../../modules/utility.js");

exports.run = (bot, interaction, suffix, help) => {
    const utility = require("../../modules/utility.js");
    const queueHandler = require("../../modules/queue/utility/queueHandler")
    const index = require("../../index")

    if (!utility.isOwner(interaction.user.id))
        return utility.errorReply("This command is for the bot owner only.", interaction);

    if (help) {
        var embed = utility.createEmbed("Restart snipers");
        embed.setDescription("More details for the **restart** command.");
        embed.addFields({ name: "Command usage", value: "This command takes no parameters." });
        embed.addFields({ name: "Description", value: "Restart snipers." });
        return interaction.reply({embeds: [embed], ephemeral: false})
    }

    let claimRoleID = index.config.guild.publicSnipes.roleID;
    
    var type = interaction.options.getString("type");
    var delay = interaction.options.getString("delay");

    var typeIdx = type.includes("Nitro") ? (type.includes("Classic") ? 1 : type.includes("Basic") ? 3 : 2) : 0;

    var nitroEmojiList = [
        "",
        index.config.guild.publicSnipes.classicNitroEmoji,
        index.config.guild.publicSnipes.boostNitroEmoji,
        index.config.guild.publicSnipes.basicNitroEmoji
    ];

    var nitroEmoji = nitroEmojiList[typeIdx];

    var content = "";
    if (nitroEmoji.length > 0) {
        content += nitroEmoji + " ";
    }

    content += `Successfully claimed \`${type}\` in \`${delay}\``;

    if (claimRoleID != undefined) {
        content += ` <@&${claimRoleID}>`;
    }

    index.bot.channels.fetch(index.config.guild.publicSnipes.channelId).then((channel) => {
        channel.send(content).then((message) => {
            // ~
        }).catch((error) => {
            var logEmbed = utility.createEmbed("Failed to send public claim message");
            logEmbed.setDescription(":x: | Failed esnding message");
            logEmbed.addFields({name: "Error", value: `${error}`});
            utility.logToChannel({embeds: [logEmbed]});
        })
    }).catch((error) => {
        var logEmbed = utility.createEmbed("Failed to send public claim message");
        logEmbed.setDescription(":x: | Failed to find the public claims channel");
        logEmbed.addFields({name: "Error", value: `${error}`});
        utility.logToChannel({embeds: [logEmbed]});
    })

    var successReply = utility.createEmbed("Fake Snipe", false);
    successReply.setDescription(`A fake snipe has been sent to <#${index.config.guild.publicSnipes.channelId}>\nType: ${type}\nDelay: ${delay}`)
    interaction.reply({embeds: [successReply], ephemeral: true})
};