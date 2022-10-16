const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name: "queue-delete"
    },

    async execute(interaction, client){
        if(!interaction.member.voice.channel) return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("You arent in the Voice Channel")
                    .setDescription("You must be apart of the call to execute this command")
            ]
        })

        await interaction.message.delete();
    }
}