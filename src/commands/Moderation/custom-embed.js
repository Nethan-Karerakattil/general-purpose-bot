const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("custom-embed")
        .setDescription("Takes JSON input and/or plain text and returns a message")

        .addStringOption(option => option
            .setName("json-text")
            .setDescription("Valid JSON code")
            .setRequired(true)),

    async execute(interaction, client){
        const json = interaction.options.getString("json-text")

        await interaction.editReply(JSON.parse(json))
        .catch(async err => {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Something went wrong")
                        .setDescription("```" + err + "```\nFor help, vist this --> https://birdie0.github.io/discord-webhooks-guide/structure/embeds.html")
                        .setColor(0xdf2c14)
                ]
            })
        })
    }
}