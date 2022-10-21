const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "error",

    async execute(error, queue, client){
        const channel = queue.data.originalChannel

        await channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Something went wrong: ${error}`)
                    .setColor(0xdf2c14)
            ]
        })
    }
}