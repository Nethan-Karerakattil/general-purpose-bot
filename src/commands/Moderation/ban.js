const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bans a Member")
        
        .addUserOption(option => option
            .setName("user")
            .setDescription("Select a user")
            .setRequired(true))
            
        .addStringOption(option => option
            .setName("reason")
            .setDescription("Reason for ban (Optional)"))
            
        .addIntegerOption(option => option
            .setName("days")
            .setDescription("Number of days to ban for (Leave blank if permanent)")),

    async execute(interaction, client){
        const { member, guild } = interaction;

        const user = interaction.options.getUser("user");
        const target = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason") || "Not Provided";
        const days = interaction.options.getInteger("days");

        if(!member.permissions.has(PermissionsBitField.Flags.BanMembers))
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Insufficient Permissions")
                        .setDescription("You do not have the permission to ban members")
                        .setColor(0xdf2c14)
                ]
            })

        if(!target.bannable) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Unable to ban")
                    .setDescription("I am not allowed to ban this member")
                    .setColor(0xdf2c14)
            ]
        })

        if(user.id === member.id) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Unable to ban")
                    .setDescription("You cannot ban yourself")
                    .setColor(0xdf2c14)
            ]
        })

        await user.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`You have been banned from ${guild.name}`)
                    .setDescription(`You have been banned from ${guild.name} for ${reason}`)
                    .setColor(0xdf2c14)
            ]
        })

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Successfully Banned ${user.tag}!`)
                    .setDescription(`User: ${user}
                    Reason: ${reason}
                    Days: ${days || "Permanently"}`)
                    .setFooter({ text: "Created By NASTYBOI#6205" })
                    .setColor(0x3ded97)
            ]
        })

        target.ban({ reason: reason, days: days });

    }
}