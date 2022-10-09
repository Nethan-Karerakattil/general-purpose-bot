const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "clientDisconnect",

    async execute(queue, client){
        const channel = client.channels.cache.get(queue.data.originalChannel);

        await channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Disconnected The Player")
                    .setDescription("Someone disconnected the player. The queue is destroyied")
                    .setColor(0xdf2c14)
            ]
        })
    }
}