const { EmbedBuilder } = require("discord.js");
const pollModel = require("../../../models/pollModel");

module.exports = {
    data: {
        name: "poll-option-2"
    },

    async execute(interaction, client){
        const user = interaction.user;

        pollModel.findOne({ msg_id: interaction.message.id }, async (err, data) => {
            if(err) return console.log(err);

            for(const option of data.options){
                for(vote of option.votes){

                    if(vote.match(interaction.member.id))
                        return await user.send({
                            embeds: [
                                new EmbedBuilder()  
                                    .setDescription("You have already Voted")
                                    .setColor(0xdf2c14)
                            ]
                        })
                }
            }

            data.options[1].votes.push(interaction.member.id)

            await data.save()

            await user.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("You voted")
                        .setColor(0x3ded97)
                ]
            })
        }
    )}
}