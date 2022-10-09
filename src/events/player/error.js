const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "error",

    async execute(error, queue, client){
        const channel = client.channels.cache.get(queue.data.originalChannel);

        await channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Something went wrong: ${error}`)
                    .setColor(0xdf2c14)
            ]
        })
    }
}