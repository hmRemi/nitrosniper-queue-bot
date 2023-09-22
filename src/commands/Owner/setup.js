const index = require("../../index");

async function sendQueueEmbedPlaceHolder(bot) {
    let guild = bot.guilds.cache.get(index.config.guild.id)

    if (guild == undefined)
        return {ok: false, message: undefined, error: "Guild not found."};

    let channel = guild.channels.cache.get(index.config.guild.queueEmbed.channelId);

    if (channel == undefined)
        return { ok: false, message: undefined, error: "Channel not found." }

    let finalError = null;

    let message = await channel.send({content: "Placeholder.."}).catch(async (error) => {
        finalError = error;
    });

    return { ok: true, message: message, error: finalError };
}

exports.run = (bot, interaction, suffix, help) => {
    const utility = require("../../modules/utility.js");

    if (!utility.isOwner(interaction.user.id))
        return utility.errorReply("This command is for the bot owner only.", interaction);

    if (help) {
        var embed = utility.createEmbed("Setup");
        embed.setDescription("More details for the **setup** command.");
        embed.addFields({ name: "Command usage", value: "This command takes no parameters." });
        embed.addFields({ name: "Description", value: "Send your place-holder messages and easily setup the config." });
        return interaction.reply({embeds: [embed], ephemeral: false})
    }

    var embed = utility.createEmbed("Setup");
    embed.setDescription("Starting setup. Please edit config when setup is ready!");

    interaction.reply({embeds: [embed], ephemeral: false}).then(inter_message => {
        sendQueueEmbedPlaceHolder(bot).then(result => {
            var ok = result.ok;
            var message = result.message;
            var error = result.error;
    
            if (error != null) {
                embed.addFields({name: "Queue ID", value: `Error: ${error}`, inline: true});
                return interaction.editReply({embeds: [embed], ephemeral: false});
            }
    
            if (ok != true || message == undefined || message == null) {
                embed.addFields({name: "Queue ID", value: "Unknown error", inline: true});
                return interaction.editReply({embeds: [embed], ephemeral: false});
            }
    
            embed.addFields({name: "Queue ID", value: `\`${message.id}\``, inline: true});
            interaction.editReply({embeds: [embed], ephemeral: false});
        });
    }).catch(error => {
        console.log(error)
    });
};