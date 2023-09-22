"use strict";

// Libraries
const { NodeSSH } = require("node-ssh");

module.exports = {
    connect: function(username, password, host, callback) {
        const connection = new NodeSSH();

        connection.connect({
            username: username,
            password: password,
            tryKeyboard: true,
            host: host,
            port: 22
        }).then(function() { callback(connection) });
    }
}