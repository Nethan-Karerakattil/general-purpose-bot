const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffles the queue"),

    async execute(interaction, client){
        if(!interaction.member.voice.channel) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("No Voice Channel Detected")
                    .setDescription("You must join a Voice Channel before writting the shuffle command")
                    .setColor(0xdf2c14)
            ]
        })

        const guildQueue = client.player.getQueue(interaction.guild.id);

        if(!guildQueue?.data) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("You must use the Play Command")
                    .setDescription("You must use the Play Command before writting the Shuffle Command")
                    .setColor(0xdf2c14)
            ]
        })

        await guildQueue.shuffle();

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Shuffled the Queue")
                    .setFooter({ text: "Created By Strange Cat#6205" })
                    .setColor(0x3ded97)
            ]
        })
    }
}