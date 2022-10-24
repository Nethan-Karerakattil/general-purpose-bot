const { EmbedBuilder, Embed } = require("discord.js");
const giveawayModel = require("../../../models/giveawayModel");

module.exports = {
    data: {
        name: "giveaway-join"
    },

    async execute(interaction, client){
        const messageID = interaction.message.id;

        giveawayModel.findOne({ msg_id: messageID }, async (err, data) => {
            if(err) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Something went wrong")
                        .setDescription("Something went wrong when trying to pull up the Data")
                        .setColor(0xdf2c14)
                ],
                ephemeral: true
            })

            if(data.joinedUsers.includes(interaction.member.id))
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("You have already joined")
                            .setDescription("You have already join this giveaway.")
                            .setColor(0xdf2c14)

                    ],
                    ephemeral: true
                })

            data.joinedUsers.push(interaction.member.id);
            data.save();

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("You joined the giveaway 🎉")
                        .setColor(0x3ded97)
                ],
                ephemeral: true
            })
        })
    }
}