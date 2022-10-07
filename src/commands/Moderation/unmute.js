const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Unmutes a member")

        .addUserOption(option => option
            .setName("user")
            .setDescription("Enter user's name")
            .setRequired(true)),

    async execute(interaction, client){
        const { member, guild } = interaction;

        const target = interaction.options.getMember("user");

        if(!member.permissions.has(PermissionsBitField.Flags.MuteMembers))
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Insufficient Permissions")
                        .setDescription("You do not have the permission to unmute members")
                ]
            })

        if(target.id === guild.ownerId) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Unable to unmute")
                    .setDescription("I am not allowed to unmute the owner")
            ]
        })

        if(target.id === member.id) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Unable to unmute")
                    .setDescription("You cannot unmute yourself")
            ]
        })

        await target.timeout(null)
        .catch(async err => {
            console.log(err);

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Something went wrong")
                        .setDescription("Something went wrong when trying to execute this command")
                ]
            })
        })

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Successfully Unmuted ${target.user.username}#${target.user.discriminator}`)
                    .setDescription(`${target.user.username}#${target.user.discriminator} was unmuted`)
                    .setFooter({ text: "Created By NASTYBOI#6205" })
                    .setColor(0x3ded97)
            ]
        })
    }
}