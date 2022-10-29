const { EmbedBuilder } = require("discord.js");
const Model = require("../../../models/ticTacToeModel");
const mainFile = require("../../../commands/Fun/tic-tac-toe");

module.exports = {
    data: {
        name: "tic-tac-2"
    },

    async execute(interaction, client){
        mainFile.hanldeClicks(interaction, client, 1);
    }
}