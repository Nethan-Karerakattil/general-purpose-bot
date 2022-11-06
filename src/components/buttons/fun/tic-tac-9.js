const mainFile = require("../../../commands/Fun/tic-tac-toe");

module.exports = {
    data: {
        name: "tic-tac-9"
    },

    execute(interaction, client){
        mainFile.hanldeClicks(interaction, client, 8);
    }
}