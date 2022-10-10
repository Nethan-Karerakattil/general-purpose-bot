const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const warnModel = require("../../models/warnModel");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Adds a warn to a user")

        .addUserOption(option => option
            .setName("user")
            .setDescription("User to warn")
            .setRequired(true))
            
        .addStringOption(option => option
            .setName("reason")
            .setDescription("Reason for warn (Optional)")),

    async execute(interaction, client){
        const { member, guild } = interaction;
        const target = await interaction.options.getUser("user");
        const reason = await interaction.options.getString("reason") || "Not Provided";

        if(!member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Insufficient Permissions")
                        .setDescription("You do not have the permission to Moderate Members")
                        .setColor(0xdf2c14)
                ]
            })

        if(target.id === guild.ownerId) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Unable to Warn")
                    .setDescription("I cannot warn the Owner")
                    .setColor(0xdf2c14)
            ]
        })

        if(target.id === member.id) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Unable to Warn")
                    .setDescription("I cannot warn yourself")
                    .setColor(0xdf2c14)
            ]
        })

        warnModel.findOne({ user_id: target.id }, async (err, data) => {
            if(err) return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Something went wrong")
                        .setDescription("Something went wrong when trying to warn this user")
                        .setColor(0xdf2c14)
                ]
            })

            switch(data){
                case null:
                    const userWarn = new warnModel({
                        user_id: target.id,
    
                        warns: [{
                            reason: reason,
                            moderator_id: member.id,
                        }]
                    })

                    await userWarn.save();
                    sendMsg();

                break;
                default:
                    data.warns.push({
                        reason: reason,
                        moderator_id: member.id
                    })

                    await data.save();
                    sendMsg();

                break;
            }
        })

        async function sendMsg(){
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Warned ${target.tag}`)
                        .setDescription(`Gave a warn to ${target}
                        Reason: ${reason}`)
                        .setFooter({ text: "Created By NASTYBOI#6205" })
                        .setColor(0x4e5d94)
                ]
            })

            await target.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`You were warned in ${guild.name}`)
                        .setDescription(`You were warned in ${guild.name}
                        Reason: ${reason}`)
                        .setColor(0xdf2c14)
                ]
            })
        }
    }
}