const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("get-volume")
        .setDescription("Gets volume of player"),

    async execute(interaction, client){
        if(!interaction.member.voice.channel) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("No Voice Channel Detected")
                    .setDescription("You must join a Voice Channel before writting the get-volume command")
                    .setColor(0xdf2c14)
            ]
        })

        const guildQueue = client.player.getQueue(interaction.guild.id);

        if(!guildQueue?.data) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("You must use the Play Command")
                    .setDescription("You must use the Play Command before writting the get-volume Command")
                    .setColor(0xdf2c14)
            ]
        })

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Current Volume: ${guildQueue.volume}%`)
                    .setFooter({ text: "Created By NASTYBOI#6205" })
                    .setColor(0x3ded97)
            ]
        })
    }
}