const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Sets the volume of a command")
        
        .addIntegerOption(option => option
            .setName("volume-value")
            .setDescription("Volume to set in percentage")),

    async execute(interaction, client){
        if(!interaction.member.voice.channel) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("No Voice Channel Detected")
                    .setDescription("You must join a Voice Channel before sending this command")
                    .setColor(0xdf2c14)
            ]
        })

        const guildQueue = client.player.getQueue(interaction.guild.id);

        if(!guildQueue?.data) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("You must use the Play Command")
                    .setDescription("You must use the Play Comand before using this commmand")
                    .setColor(0xdf2c14)
            ]
        })

        const prevVolume = String(guildQueue.volume);
        guildQueue.setVolume(interaction.options.getInteger("volume-value"));

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Volume changed from ${prevVolume}% to ${guildQueue.volume}%`)
                    .setFooter({ text: "Created By Strange Cat#6205" })
                    .setColor(0x3ded97)
            ]
        })
    }
}