const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows the Queue"),

    async execute(interaction, client){
        if(!interaction.member.voice.channel) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("No Voice Channel Detected")
                    .setDescription("You must join a Voice Channel before executing this command")
            ]
        })

        const guildQueue = client.player.getQueue(interaction.guild.id);

        await interaction.editReply(
            await guildQueue.data.getQueueMsg(0, guildQueue)
        )

        setTimeout(() => interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Message Timed Out")
                    .setDescription("The Message has Timed Out to save resources")
                    .setColor(0xdf2c14)
            ],
            components: []
        }), 300000);
    }
}