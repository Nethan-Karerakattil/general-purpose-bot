const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "channelEmpty",

    async execute(queue, client){
        const channel = client.channels.cache.get(queue.data.originalChannel);

        channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Left the Voice Channel")
                    .setDescription("Left the Voice Channel because everyone left")
                    .setColor(0xdf2c14)
            ]
        })
    }
}