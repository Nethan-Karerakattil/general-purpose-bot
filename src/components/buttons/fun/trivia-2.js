const mainFile = require("../../../commands/Fun/trivia");

module.exports = {
    data: {
        name: "trivia-2"
    },

    execute(interaction, client){
        mainFile.handleClicks(interaction, client, 1);
    }
}