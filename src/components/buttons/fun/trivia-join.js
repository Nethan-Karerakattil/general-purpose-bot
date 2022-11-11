const { EmbedBuilder } = require("discord.js");
const Model = require("../../../models/triviaModel");

module.exports = {
    data: {
        name: "trivia-join"
    },

    async execute(interaction, client){
        Model.findOne({ msg_id: interaction.message.id }, async (err, data) => {
            if(err) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Something went wrong")
                        .setDescription("Something went wrong when trying to pull up the data")
                        .setColor(0xdf2c14)
                ],
                ephemeral: true
            })

            if(data == null) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Something went wrong")
                        .setDescription("The data received was null.")
                        .setColor(0xdf2c14)
                ],
                ephemeral: true
            })

            for(let i = 0; i < data.players.length; i++){
                if(data.players[i].id == interaction.member.id)
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Nice try, but...")
                                .setDescription("You cannot join the game twice.")
                                .setColor(0xdf2c14)
                        ],
                        ephemeral: true
                    })
            }

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Successful!")
                        .setDescription("You joined the Trivia. The Trivia will start soon")
                        .setColor(0x3ded97)
                ],
                ephemeral: true
            })

            data.players.push({ id: interaction.member.id, points: 0 });
            await data.save();
        })
    }
}