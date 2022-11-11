const mainFile = require("../../../commands/Fun/trivia");

module.exports = {
    data: {
        name: "trivia-3"
    },

    execute(interaction, client){
        mainFile.handleClicks(interaction, client, 2);
    }
}