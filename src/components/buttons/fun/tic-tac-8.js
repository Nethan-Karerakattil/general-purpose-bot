const mainFile = require("../../../commands/Fun/tic-tac-toe");

module.exports = {
    data: {
        name: "tic-tac-8"
    },

    execute(interaction, client){
        mainFile.hanldeClicks(interaction, client, 7);
    }
}