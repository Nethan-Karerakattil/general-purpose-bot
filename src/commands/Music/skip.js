const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { execute } = require("./play");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips a song"),

    async execute(interaction, client){
        if(!interaction.member.voice.channel) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("No Voice Channel Detected")
                    .setDescription("You must join a Voice Channel before writting the skip command")
                    .setColor(0xdf2c14)
            ]
        })

        const guildQueue = await client.player.getQueue(interaction.guild.id);

        if(!guildQueue?.data) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("You must use the Play Command")
                    .setDescription("You must use the Play Command before writting the skip command")
                    .setColor(0xdf2c14)
            ]
        })

        await guildQueue.skip();

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Skipped the song")
                    .setFooter({ text: "Created By NASTYBOI#6205" })
                    .setColor(0x3ded97)
            ]
        })
    }
}