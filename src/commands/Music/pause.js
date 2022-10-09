const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the Player"),

    async execute(interaction, client){
        if(!interaction.member.voice.channel) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("No Voice Channel Detected")
                    .setDescription("You must join a Voice Channel before writting the Pause Command")
                    .setColor(0xdf2c14)
            ]
        })

        const guildQueue = client.player.getQueue(interaction.guild.id);

        if(!guildQueue?.data) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("You must use the Play Command")
                    .setDescription("You must use the Play Command before writting the Pause Command")
                    .setColor(0xdf2c14)
            ]
        })

        await guildQueue.setPaused(true);

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Paused the player")
                    .setFooter({ text: "Created By NASTYBOI#6205" })
                    .setColor(0x3ded97)
            ]
        })
    }
}