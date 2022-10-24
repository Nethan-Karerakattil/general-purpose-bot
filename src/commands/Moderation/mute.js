const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Gives a timeout to a user")

        .addUserOption(option => option
            .setName("user")
            .setDescription("User to Timeout")
            .setRequired(true))
            
        .addIntegerOption(option => option
            .setName("duration-days")
            .setDescription("Duration of timeout (In days)")
            .setRequired(true))
            
        .addStringOption(option => option
            .setName("reason")
            .setDescription("Reason for timeout (Optional)")),

    async execute(interaction, client){
        const { member, guild } = interaction;

        const target = interaction.options.getMember("user");
        const user = interaction.options.getUser("user");
        const duration = interaction.options.getInteger("duration-days");
        let reason = interaction.options.getString("reason");

        if(reason == null) reason = "Not Provided";

        if(!member.permissions.has(PermissionsBitField.Flags.MuteMembers))
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Insufficient Permissions")
                        .setDescription("You do not have the permission to mute members")
                        .setColor(0xdf2c14)
                ]
            })

        if(target.id === guild.ownerId) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Unable to Mute")
                    .setDescription("I am not allowed to mute the owner")
                    .setColor(0xdf2c14)
            ]
        })

        if(target.id === member.id) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Unable to Mute")
                    .setDescription("You cannot mute yourself")
                    .setColor(0xdf2c14)
            ]
        })

        await target.timeout(duration * 86400000, reason)
        .catch(async err => {
            if(err.rawError.message === "Missing Permissions")
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Insufficient Permissions")
                            .setDescription("I do not have the permission to ban mute member")
                            .setColor(0xdf2c14)
                    ]
                })

            console.log(err);

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Unknown Error")
                        .setDescription("Something went wrong when trying to execute this command")
                        .setColor(0xdf2c14)
                ]
            })
        })

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Successfully Muted ${target.user.username}#${target.user.discriminator}`)
                    .setDescription(`${target.user.username}#${target.user.discriminator} was muted for ${duration} days`)
                    .setFooter({ text: "Created By Strange Cat#6205" })
                    .setColor(0x3ded97)
            ]
        })

        await user.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`You have a timeout in ${guild.name}`)
                    .setDescription(`You were given a timeout for ${duration} days
                    Reason: ${reason}`)
                    
                    .setColor(0xdf2c14)
            ]
        })
    }
}