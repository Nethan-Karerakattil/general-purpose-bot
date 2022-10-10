const { Schema, model } = require("mongoose");

module.exports = model("User", new Schema({
    user_id: {
        type: String,
        required: [ true, "User ID is required" ]
    },

    warns: [{
        reason: String,
        moderator_id: String,
        date: {
            type: Date,
            default: Date.now
        }
    }]
}));