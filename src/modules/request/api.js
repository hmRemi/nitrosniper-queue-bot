"use strict";

// Libraries
// C change this if you wish, i copied it from discord.js
const request = require("request").defaults({
    json: true,
    headers: {
        "X-Super-Properties": "eyJvcyI6Ik1hYyBPUyBYIiwiYnJvd3NlciI6IkRpc2NvcmQgQ2xpZW50IiwicmVsZWFzZV9jaGFubmVsIjoic3RhYmxlIiwiY2xpZW50X3ZlcnNpb24iOiIwLjAuMjY5Iiwib3NfdmVyc2lvbiI6IjIwLjYuMCIsIm9zX2FyY2giOiJ4NjQiLCJzeXN0ZW1fbG9jYWxlIjoiZW4tVVMiLCJjbGllbnRfYnVpbGRfbnVtYmVyIjoxNTc3MDgsImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGx9",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.269 Chrome/91.0.4472.164 Electron/13.6.6 Safari/537.36",
        "X-Debug-Options": "bugReporterDisabled",
        "Accept-Language": "en-US,en-GB;q=0.9",
        "X-Discord-Locale": "en-GB",
        "Accept": "*/*"
    }
});

// Includes
const config = require("../../data/config.json")

module.exports = {
    getStats(callback) {
        for (var i = 0; i < config.stats.ids.length; i++) {
            var id = config.stats.ids[i];
            request.get({ url: `http://66.42.85.239/api/discord/sniper/user/stats?discordId=${id}` }, function(error, response, body) {
                if (error)
                    return callback({ ok: false, message: "Failed to make request to Api." });

                if (body.error)
                    return callback({ ok: false, message: `API gave us an error for id: \`${id}\`.` });

                let checkedMessages = body.basic.checkedMessages;
                let invitesDetected = body.basic.invitesDetected;
                let snipedNitros = body.basic.snipedNitros;
                let detectedNitros = body.basic.detectedNitros;

                if (undefined in [checkedMessages, invitesDetected, snipedNitros, detectedNitros]) {
                    return callback({ ok: false, message: `API gave us wrong/no info for id: \`${id}\`.` });
                }

                return callback({ ok: true, data: {checkedMessages: checkedMessages, invitesDetected: invitesDetected, snipedNitros: snipedNitros, detectedNitros: detectedNitros.length} })
            });
        }
    }
}