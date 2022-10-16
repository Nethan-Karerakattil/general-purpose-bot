const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Responds with pong"),

    async execute(interaction, client, message){
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Pong! 🏓")
                    .setDescription(`API Latency: ${client.ws.ping}ms\nClient Ping: ${message.createdTimestamp - interaction.createdTimestamp}ms`)
                    .setColor(0x4e5d94)
            ]
        })
    }
}