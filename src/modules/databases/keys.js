"use strict";

// Libraries
const { existsSync, writeFileSync, readFileSync } = require("fs");

// Variables
var config = require("../../data/config");

module.exports = {
    generateKey() {
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.
        var ret = "";

        for (var i = 0; i < config.shop.keyLength; i++)
            ret += characters.charAt(Math.floor(Math.random() * characters.length));

        return ret;
    },

    findKey(key) {
        var keys = this.getCurrentKeys();

        for (var i in keys)
            if (keys[i].key === key)
                return keys[i];

        return false;
    },

    addKey(totalClaims) {
        var keys = this.getCurrentKeys();
        var key = this.generateKey();

        while (this.findKey(key))
            key = this.generateKey();

        keys.push({
            "key": key,
            "claims": totalClaims
        });

        writeFileSync(this.getKeysFilePath(), JSON.stringify(keys, null, "\t") + "\n");

        return key;
    },

    removeKey(key) {
        var keys = this.getCurrentKeys();

        for (var i in keys)
            if (keys[i].key === key)
                keys.splice(i, 1);

        writeFileSync(this.getKeysFilePath(), JSON.stringify(keys, null, "\t") + "\n");
    },

    getKeysFilePath() {
        return `${__dirname}/../../data/databases/keys.json`;
    },

    getCurrentKeys() {
        return JSON.parse(readFileSync(this.getKeysFilePath()));
    }
}