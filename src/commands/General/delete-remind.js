const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const Model = require("../../models/remindModel");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete-remind")
        .setDescription("Delete a reminder")

        .addStringOption(option => option
            .setName("message-id")
            .setDescription("Message ID of the reply we sent you")
            .setRequired(true)),

    async execute(interaction, client){
        const id = interaction.options.getString("message-id");
        
        Model.findOne({ msg_id: id }, async (err, data) => {
            if(err) return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Something went wrong")
                        .setDescription("Something went wrong when trying to delete the reminder")
                        .setColor(0xdf2c14)
                ]
            })

            if(data == null) return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("The reminder doesnt exist")
                        .setDescription("The ID does not link to a reminder. Be sure to use the right ID")
                        .setColor(0xdf2c14)
                ]
            })

            clearTimeout(data.timeout_id);

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Deleted the Reminder!")
                        .setDescription("The reminder has been deleted. You will not get reminded now")
                        .setColor(0x3ded97)
                ]
            })

            await Model.deleteOne({ msg_id: id });
        })
    }
}