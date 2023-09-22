exports.run = (bot, interaction, suffix, help) => {
    const utility = require("../../modules/utility.js");
    const queue = require("../../modules/databases/queue")
    const { checkAuthentication } = require("../../modules/request/discord.js");
    const queueHandler = require("../../modules/queue/utility/queueHandler.js");

    if (!utility.isOwner(interaction.user.id))
        return utility.errorReply("This command is for the bot owner only.", interaction);

    if (help) {
        var embed = utility.createEmbed("Add");
        embed.setDescription("More details for the **add** command.");
        embed.addFields({ name: "Command usage", value: "/add <user> <token> <claims> <optional: position>" });
        embed.addFields({ name: "Description", value: "Add user to queue" });
        return interaction.reply({embeds: [embed], ephemeral: true})
    }

    var user = interaction.options.getUser("user");
    var token = interaction.options.getString("token");
    var claims = interaction.options.getInteger("claims");
    var position = interaction.options.getInteger("position") ?? null;

    if (token.length < 20)
        return utility.errorReply("Invalid token, please input a valid token.", interaction); 

    checkAuthentication(token, function(authenticationCheckResponse) {
    	if (!authenticationCheckResponse.ok) {
    		return utility.errorReply(authenticationCheckResponse.message, interaction);
        }

        queue.addUserToQueue(user.tag, user.id, token, claims, position)
    	queueHandler.checkQueue();

        utility.LOG(queue.getCurrentQueue());
    	utility.successReply("Successfully added user to queue. They will get notified when they get a nitro.", interaction);
    });
};