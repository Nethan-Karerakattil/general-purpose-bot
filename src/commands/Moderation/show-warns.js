const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const warnModel = require("../../models/warnModel");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("show-warns")
        .setDescription("Shows a user's warns")

        .addUserOption(option => option
            .setName("user")
            .setDescription("The user whos warns you want to see")
            .setRequired(true)),

    async execute(interaction, client){
        const { member, guild, options } = interaction;
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

            if(data === null || data.warns.length == 0 ) return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("No warnings")
                        .setDescription("This user does not have any warnings")
                        .setFooter({ text: "Created By Strange Cat#6205" })
                        .setColor(0x4e5d94)
                ]
            })

            let embed = new EmbedBuilder()
                .setTitle(`Warnings for ${user.tag}`)
                .setFooter({ text: "Created By Strange Cat#6205" })
                .setColor(0x4e5d94);

            for(let i = 0; i < data.warns.length; i++){
                let obj = {
                    name: `Warning ${i + 1}`,
                    value: `Reason: ${data.warns[i].reason}`
                }

                embed.addFields(obj);
            }

            await interaction.editReply({
                embeds: [embed]
            })
        })
    }
}