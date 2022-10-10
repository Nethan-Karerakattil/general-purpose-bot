const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const warnModel = require("../../models/warnModel");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear-warnings")
        .setDescription("Clears the warnings of a user")

        .addUserOption(option => option
            .setName("user")
            .setDescription("User to clear warnings")
            .setRequired(true)),

    async execute(interaction, client){
        const { guild, member, options } = interaction;
        const user = options.getUser("user");

        if(!member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Insufficient Permissions")
                    .setDescription("You do not have the permission to Moderate Members")
                    .setColor(0xdf2c14)
            ]
        })

        warnModel.findOne({ user_id: user.id }, async (err, data) => {
            if(err) return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Something went wrong")
                        .setDescription("Something went wrong when trying to execute this command")
                        .setColor(0xdf2c14)
                ]
            })

            data.warns = [];

            await data.save();

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Cleared Warnings for ${user.tag}`)
                        .setFooter({ text: "Created By NASTYBOI#6205" })
                        .setColor(0x3ded97)
                ]
            })
        })
    }
}