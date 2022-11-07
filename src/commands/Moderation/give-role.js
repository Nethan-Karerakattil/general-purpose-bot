const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("give-role")
        .setDescription("Gives a role to a user")

        .addUserOption(option => option
            .setName("user")
            .setDescription("User to give the role to")
            .setRequired(true))

        .addRoleOption(option => option
            .setName("role")
            .setDescription("Role to give to the user")
            .setRequired(true)),

    async execute(interaction, client){
        const member = interaction.options.getMember("user");
        const role = interaction.options.getRole("role");

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles))
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Insufficient Permissions")
                        .setDescription("You do not have the permission to Manage Roles")
                        .setColor(0xdf2c14)
                ]
            })

        if(member.id === interaction.member.id) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Invalid User")
                    .setDescription("You cannot give a role to yourself")
                    .setColor(0xdf2c14)
            ]
        })

        if(!member.manageable) return await interaction.editReply({
            emebds: [
                new EmbedBuilder()
                    .setTitle("Invalid User")
                    .setDescription("This user is above me in the hierarchy")
                    .setColor(0xdf2c14)
            ]
        })

        await member.roles.add(role)
            .catch(async err => await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Something went wrong")
                        .setDescription("Something went wrong when trying to execute this command")
                        .setColor(0xdf2c14)
                ]
            }))
            .then(async () => await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Added the Role!")
                        .setDescription(`${role} has been added to ${member}`)
                        .setFooter({ text: "Created By Strange Cat#6205" })
                        .setColor(0x3ded97)
                ]
            }))
    }
}