const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { execute } = require("./ban");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kicks a Member")

        .addUserOption(option => option
            .setName("user")
            .setDescription("User to kick")),

    async execute(interaction, client){
        const { member, guild } = interaction;

        const user = interaction.options.getUser("user");
        const target = interaction.options.getMember("user");
        
        if(!member.permissions.has(PermissionsBitField.Flags.KickMembers))
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Insufficient Permissions")
                        .setDescription("You do not have the permissions to kick a member")
                ]
            })

        if(!target.kickable) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Unable to kick")
                    .setDescription("I am not allowed to kick this member")
            ]
        })

        if(user.id === member.id) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Unable to kick")
                    .setDescription("You cannot kick yourself")
            ]
        })

        await user.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`You have been kicked from ${guild.name}`)
                    .setDescription(`You may join the server again if you get an invite`)
                    .setColor(0xdf2c14)
            ]
        })


        await target.kick();

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Successfully Kicked ${user.tag}`)
                    .setDescription(`${user.tag} has been kicked from ${guild.name}`)
                    .setFooter({ text: "Created By NASTYBOI#6205" })
                    .setColor(0x3ded97)
            ]
        })
    }
}