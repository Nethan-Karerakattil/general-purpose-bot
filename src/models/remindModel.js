const { Schema, model } = require("mongoose");

module.exports = model("remind", new Schema({
    msg_id: String,
    user_id: String,

    timeout_id: {},
}));