const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("seek")
        .setDescription("Seeks in a song")

        .addIntegerOption(option => option
            .setName("minutes")
            .setDescription("Minute to jump to"))
            
        .addIntegerOption(option => option
            .setName("seconds")
            .setDescription("Second to jump to")),

    async execute(interaction, client){
        if(!interaction.member.voice.channel) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("No Voice Channel Detected")
                    .setDescription("You must join a Voice Channel before writting the seek command")
                    .setColor(0xdf2c14)
            ]
        })

        if(!interaction.options.getInteger("minutes") && !interaction.options.getInteger("seconds"))
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Choose atleast one option")
                        .setDescription("You must choose atleast one options for the command to work")
                        .setColor(0xdf2c14)
                ]
            })

        const guildQueue = await client.player.getQueue(interaction.guild.id);

        if(!guildQueue?.data) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("You must use the Play Command")
                    .setDescription("You must use the Play Command before writting the seek command")
                    .setColor(0xdf2c14)
            ]
        })

        const minutes = await interaction.options.getInteger("minutes") || 0;
        const seconds = await interaction.options.getInteger("seconds") || 0;

        seek(minutes, seconds);

        async function seek (mins, secs){
            await guildQueue.seek((mins * 60000) + (secs * 1000))

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Seeked to ${mins}:${secs}`)
                        .setFooter({ text: "Created By Strange Cat#6205" })
                        .setColor(0x3ded97)
                ]
            })
        }
    }
}