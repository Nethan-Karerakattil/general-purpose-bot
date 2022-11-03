const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quote")
        .setDescription("Gives you a random quote"),

    async execute(interaction, client){
        const url = "https://zenquotes.io/api/quotes/";
        const [ response ] = await (await fetch(url)).json();

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription("```" + response.q + "\n    -" + response.a + "```")
                    .setFooter({ text: "Created By Strange Cat#6205" })
                    .setColor(0x4e5d94)
            ]
        })
    }
}