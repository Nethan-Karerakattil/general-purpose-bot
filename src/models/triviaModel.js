const { Schema, model } = require("mongoose");

module.exports = model("trivia", new Schema({
    msg_id: String,
    difficulty: String,
    category: String,

    players: [{
        id: String,
        points: Number
    }],
    rounds: {
        total: Number,
        completed: Number
    }
}));