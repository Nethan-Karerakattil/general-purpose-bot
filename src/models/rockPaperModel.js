const { Schema, model } = require("mongoose");

module.exports = model("rockPaper", new Schema({
    msg_id: String,

    player1: [],
    player2: [],
}));