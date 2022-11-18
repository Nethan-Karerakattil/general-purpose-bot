const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dictionary")
        .setDescription("Look up a word in a dictionary")
        
        .addStringOption(option => option
            .setName("word")
            .setDescription("Word that you want to search for")
            .setRequired(true)),

    async execute(interaction, client){
        const word = interaction.options.getString("word");

        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
        const response = await (await fetch(url)).json();

        if(response?.title) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(response.title)
                    .setDescription(response.message)
                    .setColor(0xdf2c14)
            ]
        })

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Word: ${response[0].word} (${response[0].phonetic || "No Phonetic Available"})`)
                    .setDescription(response[0].meanings[0].definitions[0].definition)
                    .setColor(0x4e5d94)
            ]
        })
    }
}