"use strict";

// Libraries
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

module.exports = {
    checkAuthentication: function(token, callback) {
        request.get({ url: "https://discord.com/api/v9/users/@me", headers: { "Authorization": token.trim() } }, function(error, response, body) {
            if (error)
                return callback({ ok: false, message: "Failed to make request to Discord." });

            if (response.statusCode == 200) {
                // if (body.mfa_enabled)
                    // return callback({ ok: false, message: "Please disable 2FA while you're in the queue." });

                callback({ ok: true, message: null });
            } else if (response.statusCode == 401)
                return callback({ ok: false, message: "Your authentication token isn't valid" });
            else
                return callback({ ok: false, message: `Failed to check authentication - ${response.statusCode}` });
        });
    }
}