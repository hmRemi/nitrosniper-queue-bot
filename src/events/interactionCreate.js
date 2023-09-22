module.exports = async function(bot, interaction) {
    if (!interaction.isChatInputCommand()) return;

    const { sendHelp } = require("../modules/utility.js");
    const { readdirSync, existsSync } = require("fs");

    const categories = readdirSync(`${__dirname}/../commands/`);
    let command = interaction.commandName.toLowerCase();

    if (command == "help") {
    	var suffix = interaction.options.getString("command");

        if (suffix) {
            categories.forEach(category => {
                try {
                    var path = `${__dirname}/../commands/${category}/${suffix}.js`;

                    if (existsSync(path)) {
                        require(path).run(bot, interaction, suffix, true);
                        delete require.cache[require.resolve(path)];
                    }
                } catch (error) {
                    console.log(error.stack);
                }
            });
        } else {
            var commands = [];

            categories.forEach(category => {
                commands.push(readdirSync(`${__dirname}/../commands/${category}/`).join(", ").replace(/.js/g, ""));
            });

            sendHelp(categories, commands, interaction);
        }
    } else {
        categories.forEach(category => {
            try {
                var path = `${__dirname}/../commands/${category}/${command}.js`;

                if (existsSync(path)) {
                    require(path).run(bot, interaction, suffix, false);
                    delete require.cache[require.resolve(path)];
                }
            } catch (error) {
                console.log(error.stack);
            }
        });
    }
}