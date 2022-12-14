const { Schema, model } = require("mongoose");

module.exports = model("ticModel", new Schema({
    message_id: {
        type: String,
        required: [ true, "Message ID is required" ]
    },

    timeout_id: {
        type: Number,
        required: [ true, "Timeout ID is required" ]
    },

    player1: String,
    player2: String,

    turn: {
        type: Number,
        required: [ true, "You must specify the turn" ]
    },

    board: []
}));