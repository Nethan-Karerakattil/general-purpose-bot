const mainFile = require("../../../commands/Fun/tic-tac-toe");

module.exports = {
    data: {
        name: "tic-tac-1"
    },

    execute(interaction, client){
        mainFile.hanldeClicks(interaction, client, 0);
    }
}