const { Schema, model } = require("mongoose");

module.exports = model("giveaway", new Schema({
    joinedUsers: [
        { type: String }
    ]
}));