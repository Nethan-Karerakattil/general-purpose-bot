const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "songChanged",

    async execute(queue, newSong, oldSong, client){
        const channel = queue.data.originalChannel

        await channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Changed song to ${newSong.name}`)
                    .setColor(0x3ded97)
            ]
        })
    }
}