const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const Model = require("../../models/remindModel");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-remind")
        .setDescription("Sets a reminder")

        .addIntegerOption(option => option
            .setName("hours")
            .setDescription("When should we remind you?")
            .setRequired(true))

        .addStringOption(option => option
            .setName("message")
            .setDescription("Message to deliver when the time is up")),

    async execute(interaction, client){
        const time = interaction.options.getInteger("hours");
        const msg = interaction.options.getString("message");

        if(time > 168) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Too much time")
                    .setDescription("You cannot set a reminder for more than a week")
                    .setColor(0xdf2c14)
            ]
        })

        const message = await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Set the reminder!")
                    .setDescription(`We set the reminder for ${time} hrs`)
                    .setColor(0x3ded97)
            ]
        })

        const timeout = setTimeout(async () => await interaction.user.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("The reminder is up!")
                    .setDescription(`Message: ${msg}`)
                    .setFooter({ text: "Created By Strange Cat#6205" })
                    .setColor(0x3ded97)
            ]
        }), time * 3600000)

        new Model({
            msg_id: message.id,
            timeout_id: timeout.id
        }).save();
    }
}