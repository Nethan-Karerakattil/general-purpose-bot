const { Schema, model } = require("mongoose");

module.exports = model("ticModel", new Schema({
    message_id: {
        type: String,
        required: [ true, "Message ID is required" ]
    },

    player_1: {
        type: String,
        required: [ true, "Player 2's ID is required"]
    },

    player_2: {
        type: String,
        required: [ true, "Player 2's ID is required"]
    },

    turn: {
        type: Number,
        required: [ true, "You must specify the turn" ]
    },

    board: [
        { stat: Number }, { stat: Number }, { stat: Number },
        { stat: Number }, { stat: Number }, { stat: Number },
        { stat: Number }, { stat: Number }, { stat: Number },
    ]
}));