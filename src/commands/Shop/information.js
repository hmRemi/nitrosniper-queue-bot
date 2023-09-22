exports.run = (bot, interaction, suffix, help) => {
    const utility = require("../../modules/utility.js");

    if (help) {
        var embed = utility.createEmbed("Information");
        embed.setDescription("More details for the **key** command.");
        embed.addFields({ name: "Command usage", value: "/information" });
        embed.addFields({ name: "Description", value: "Get information on how it works" });
        return interaction.reply({ ephemeral: true, embeds: [embed] })
    }


    var embed = utility.createEmbed("Information");
    embed.setDescription(`
    **What is Nitro Sniping?**
    A nitro sniper is a tool which utilises discord account tokens to sniper nitro from a wide range of different servers, When a discord user sends a nitro link, the tool will detect it and will attempt to claim it onto an account.
    
    **Can I get banned for this?**
    As nitro sniping is against discord terms of service, yes.. But very unlikely.

    **What is the process?**
    You would create a ticket in the server or dm me, we can then talk about how many claims you want, payment etc. Once paid; you will be messaged a key from the bot. Then go back to the server and type **/redeem <key> <token>**`)

    interaction.reply({ ephemeral: true, embeds: [embed] });
};