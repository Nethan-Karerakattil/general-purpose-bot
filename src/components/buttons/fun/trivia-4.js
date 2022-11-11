const mainFile = require("../../../commands/Fun/trivia");

module.exports = {
    data: {
        name: "trivia-4"
    },

    execute(interaction, client){
        mainFile.handleClicks(interaction, client, 3);
    }
}