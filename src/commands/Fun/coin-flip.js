const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("coin-flip")
        .setDescription("Flip a coin!"),

    async execute(interaction){
        const randomSide = (["Heads", "Tails"])[Math.floor(Math.random() * 2)];

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${randomSide} Won!`)
                    .setColor(0x4e5d94)
            ]
        })
    }
}