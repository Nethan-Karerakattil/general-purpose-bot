const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "queueEnd",

    async execute(queue, client){
        const channel = queue.data.originalChannel

        await channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Left the Voice Channel")
                    .setDescription("Left the Voice Channel because the song queue got over")
                    .setColor(0xdf2c14)
            ]
        })
    }
}