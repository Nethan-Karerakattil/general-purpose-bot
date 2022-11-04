const { Schema, model } = require("mongoose");

module.exports = model("crossServerMessage", new Schema({
    content: String,
    msg_id: String,

    original_sender: String,
    original_server: String
}));