module.exports = (bot, message) => {
    console.log("[+] Logged in as: %s", bot.user.tag);
    console.log("[?] Servers: %d\r\n", bot.guilds.cache.size);
}