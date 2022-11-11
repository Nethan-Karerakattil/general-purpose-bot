const mainFile = require("../../../commands/Fun/trivia");

module.exports = {
    data: {
        name: "trivia-1"
    },

    execute(interaction, client){
        mainFile.handleClicks(interaction, client, 0);
    }
}