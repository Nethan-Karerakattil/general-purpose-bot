const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("toggle-loop")
        .setDescription("Toggles the song loop on/off"),

    async execute(interaction, client){
        if(!interaction.member.voice.channel) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("No Voice Channel Detected")
                    .setDescription("You must join a Voice Channel before writting the toggle-loop command")
                    .setColor(0xdf2c14)
            ]
        })

        const guildQueue = await client.player.getQueue(interaction.guild.id);

        if(!guildQueue?.data) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("You must use the Play Command")
                    .setDescription("You must use the Play Command before writting the toggle-loop command")
                    .setColor(0xdf2c14)
            ]
        })

        await guildQueue.setRepeatMode(1);

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Toggled the song loop")
                    .setFooter({ text: "Created By NASTYBOI#6205" })
                    .setColor(0x3ded97)
            ]
        })
    }
}