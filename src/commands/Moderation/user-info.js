const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const warnModel = require("../../models/warnModel");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user-info")
        .setDescription("Shows information about a user")

        .addUserOption(option => option
            .setName("user")
            .setDescription("User to show information about (Optional)")),

    async execute(interaction, client){
        const { guild } = interaction;
        const member = interaction.options.getMember("user") || interaction.member;
        const user = interaction.options.getUser("user") || interaction.user;

        const createdAt = new Date(user.createdAt);
        const date = `${createdAt.getDate()}/${createdAt.getMonth()}/${createdAt.getFullYear()}`;
        const time = `${createdAt.getHours()}:${createdAt.getMinutes()}:${createdAt.getSeconds()}`;

        const joinedAt = new Date(member.joinedAt);
        const joinDate = `${joinedAt.getDate()}/${joinedAt.getMonth()}/${joinedAt.getFullYear()}`;
        const joinTime = `${joinedAt.getHours()}:${joinedAt.getMinutes()}:${joinedAt.getSeconds()}`;

        const warnings = await warnModel.findOne({ user_id: member.id });

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Information about ${user.username}`)
                    
                    .addFields(
                        {
                            name: "Name",
                            value: user.toString(),
                            inline: true
                        },
                        {
                            name: "ID",
                            value: member.id.toString(),
                            inline: true
                        },
                        {
                            name: "Discriminator",
                            value: `${user.discriminator}`,
                            inline: true
                        },
                        {
                            name: "Warnings",
                            value: warnings.warns.length.toString() || "0",
                            inline: true
                        },
                        {
                            name: "Created At",
                            value: `${date} ${time}`,
                            inline: true
                        },
                        {
                            name: "Joined At",
                            value: `${joinDate} ${joinTime}`,
                            inline: true
                        }
                    )
            ]
        })
    }
}