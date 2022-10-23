const { Schema, model } = require("mongoose");

module.exports = model("poll", new Schema({
    server_id: {
        type: String,
        required: [ true, "Server ID is required" ]
    },

    msg_id: {
        type: String,
        required: [ true, "Message ID is required" ]
    },

    question: {
        type: String,
        required: [ true, "Question is required" ]
    },

    options: [
        {
            name: { type: String, required: [ true, "Option Name is required" ]},
            votes: [
                {
                    type: String,
                }
            ]
        }
    ]
}));