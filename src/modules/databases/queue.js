"use strict";

// Libraries
const { existsSync, writeFileSync, readFileSync } = require("fs");

module.exports = {
    getUserData(discordId) {
        var queue = this.getCurrentQueue();
        let ret = []

        for (var i = 0; i < queue.length; i++) {
            if (queue[i].discordId == discordId)
                ret.push({position: i + 1, data: queue[i]})
        }

        return ret;
    },

    getDataAtPosition(position) {
        var queue = this.getCurrentQueue();

        // todo: look into avoiding loop here
        for (var i = 0; i < queue.length; i++) {
            if (position == i + 1)
                return queue[i];
        }

        return null;
    },

    removeData(position) {
        var data = this.getDataAtPosition(position)
        if (data == null) {
            return false;
        }

        var queue = this.getCurrentQueue();
        queue.splice(position - 1, 1);

        this.writeToQueue(queue);
        return true;
    },

    moveData(position, newPosition) {
        // https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
        // leaving credits. i was lazy to work on this
        function arrayMove(arr, oldIndex, newIndex) {
            if (newIndex >= arr.length) {
                var k = newIndex - arr.length + 1;

                while (k--)
                    arr.push(undefined);
            }

            arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);

            return arr;
        }
        
        var data = this.getDataAtPosition(position);

        if (data == null)
            return false;

        var queue = this.getCurrentQueue()
        arrayMove(queue, position - 1, newPosition - 1);

        this.writeToQueue(queue);
        return true;
    },

    // i'll kms, look at this code, how non-clean it is.. atleast it does the job correctly ~snek
    addUserToQueue(username, discordId, authToken, claimAmount, overridePosition) {
        var queue = this.getCurrentQueue();

        if (overridePosition != null) {
            // atleast add to the end if it's not gonna be good
            var hasAdded = false
            var newQueue = []
            for (var i = 0; i < queue.length; i++) {
                if (overridePosition == i + 1) {
                    // check if it's already that same token and user, and add claims
                    if (queue[i].authToken == authToken && queue[i].discordId == discordId) {
                        let totalClaimAmount = queue[i].totalClaimAmount + claimAmount;
                        let currentClaimAmount = queue[i].currentClaimAmount
                        newQueue.push({
                            "authToken": authToken,
                            "discordId": discordId,
                            "username": username,
                            "totalClaimAmount": totalClaimAmount,
                            "currentClaimAmount": currentClaimAmount
                        })

                        hasAdded = true
                        continue;
                    }

                    newQueue.push({
                        "authToken": authToken,
                        "discordId": discordId,
                        "username": username,
                        "totalClaimAmount": claimAmount,
                        "currentClaimAmount": 0
                    })

                    hasAdded = true
                }

                newQueue.push(queue[i])
            }

            if (!hasAdded) {
                newQueue.push({
                    "authToken": authToken,
                    "discordId": discordId,
                    "username": username,
                    "totalClaimAmount": claimAmount,
                    "currentClaimAmount": 0
                })
            }
            
            this.writeToQueue(newQueue);
            return;
        }

        // check if it's already last, and add claims
        var lastInQueue = this.getLastInQueue();

        if (lastInQueue != null) {
            if (lastInQueue.authToken == authToken && lastInQueue.discordId == discordId) {
                queue[queue.length - 1].totalClaimAmount += claimAmount
                
                this.writeToQueue(queue);
                return;
            }
        }

        queue.push({
            "authToken": authToken,
            "discordId": discordId,
            "username": username,
            "totalClaimAmount": claimAmount,
            "currentClaimAmount": 0
        });

        this.writeToQueue(queue);
    },

    onUserNewClaim(authToken, claimAmount) {
        if (claimAmount == undefined || claimAmount == null)
            claimAmount = 1

        var queue = this.getCurrentQueue();

        for (var i in queue) {
            if (queue[i].authToken == authToken) {
                queue[i].currentClaimAmount += claimAmount;

                this.writeToQueue(queue);
                break;
            }
        }
    },

    getLastInQueue() {
        var queue = this.getCurrentQueue();

        if (queue.length <= 0)
            return null;

        return queue[queue.length - 1]
    },

    getQueueFilePath() {
        return `${__dirname}/../../data/databases/queue.json`;
    },

    getCurrentQueue() {
        return JSON.parse(readFileSync(this.getQueueFilePath()));
    },

    writeToQueue(queue) {
        return writeFileSync(this.getQueueFilePath(), JSON.stringify(queue, null, "\t") + "\n");
    }
}