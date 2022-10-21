const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name: "queue-delete"
    },

    async execute(interaction, client){
        if(!interaction.member.voice.channel) return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("No Voice Channel Detected")
                    .setDescription("You must be apart of the call to click this button")
                    .setColor(0xdf2c14)
            ],
            ephemeral: true
        })

        await interaction.message.delete();
    }
}