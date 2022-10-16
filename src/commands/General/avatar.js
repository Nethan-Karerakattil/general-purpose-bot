const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Shows a person's avatar")

        .addUserOption(option => option
            .setName("user")
            .setDescription("Member whos avatar to view (Optional)")),

    async execute(interaction, client){
        const user = interaction.options.getUser("user") || interaction.member.user;

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${user.username}'s Avatar`)
                    .setImage(user.avatarURL() || "https://i.imgur.com/75WC2s4.png")
                    .setFooter({ text: "Created By NASTYBOI#6205" })
                    .setColor(0x4e5d94)
            ]
        })
    }
}