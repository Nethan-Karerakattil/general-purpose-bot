const mainFile = require("../../../commands/Fun/rock-paper-scissors");

module.exports = {
    data: {
        name: "rps-scissors"
    },

    execute(interaction, client){
        mainFile.handleClicks(interaction, client, 2);
    }
}