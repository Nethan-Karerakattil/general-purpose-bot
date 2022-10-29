const { Schema, model } = require("mongoose");

module.exports = model("giveawaySchema", new Schema({
    joinedUsers: [
        { type: String }
    ]
}));