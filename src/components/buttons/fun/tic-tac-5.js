const Model = require("../../../models/ticTacToeModel");
const mainFile = require("../../../commands/Fun/tic-tac-toe");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name: "tic-tac-5"
    },

    async execute(interaction, client){
        mainFile.hanldeClicks(interaction, client, 4);
    }
}