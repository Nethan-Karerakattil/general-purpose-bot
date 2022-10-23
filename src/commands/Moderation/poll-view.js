const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const pollModel = require("../../models/pollModel");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll-view")
        .setDescription("Shows you the current poll")

        .addStringOption(option => option
            .setName("message-id")
            .setDescription("The message id of the poll")),

    async execute(interaction, client){
        const messageID = interaction.options.getString("message-id");

        pollModel.findOne({ msg_id: messageID }, async (err, data) => {
            if(err) return console.log(err);

            let initialMessage = new EmbedBuilder()
                .setTitle(data.question)
                .setColor(0x4e5d94)

            let totalVotes = 0;

            data.options.forEach(option => totalVotes += option.votes.length);

            for(const option of data.options){
                const percentage = (option.votes.length / totalVotes) * 100;

                initialMessage.addFields({
                    name: option.name,
                    value: `${option.votes.length} (${percentage}%)`
                });
            }

            await interaction.editReply({
                embeds: [ initialMessage ]
            })
        })
    }
}