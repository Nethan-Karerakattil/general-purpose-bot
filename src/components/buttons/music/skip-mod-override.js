const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name: "skip-mod-override"
    },

    async execute(interaction, client){
        if(!interaction.member.voice.channel) return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("No Voice Channel Detected")
                    .setDescription("You must be apart of the call to click this button")
                    .setColor(0xdf2c14)
            ],
            ephemeral: true
        })

        if(!member.permissions.has(PermissionsBitField.Flags.Administrator))
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Insufficient Permissions")
                        .setDescription("To override the skip, you must have Administrator Permissions")
                        .setColor(0xdf2c14)
                ],
                ephemeral: true
            })

        await guildQueue.skip();

        await interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Skipped the Song")
                    .setFooter({ text: "Created By NASTYBOI#6205" })
                    .setColor(0x3ded97)
            ]
        })
    }
}