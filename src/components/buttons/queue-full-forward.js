const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name: "queue-full-forward"
    },

    async execute(interaction, client){
        const guildQueue = client.player.getQueue(interaction.guild.id);
        const queueStart = Math.floor(guildQueue.songs.length / 10) * 10;

        if(!interaction.member.voice.channel) return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("You arent in the Voice Channel")
                    .setDescription("You must be apart of the call to execute this command")
            ]
        })

        await interaction.update(
            await guildQueue.data.getQueueMsg(queueStart, guildQueue)
        )

        setTimeout(() => interaction.message.edit({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Message Timed Out")
                    .setDescription("The Message Timed Out to save resources")
                    .setColor(0xdf2c14)
            ]
        }), 300000);
    }
}