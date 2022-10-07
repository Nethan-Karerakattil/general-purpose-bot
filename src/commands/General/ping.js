const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Responds with pong"),

    async execute(interaction){
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Pong!")
                    .setFooter({ text: "Created By NASTYBOI#6205" })
            ]
        })
    }
}