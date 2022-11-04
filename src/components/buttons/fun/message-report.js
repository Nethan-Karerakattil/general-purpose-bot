const Model = require("../../../models/crossServerMessage");
const { EmbedBuilder,  ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField }
    = require("discord.js");

module.exports = {
    data: {
        name: "message-report"
    },

    async execute(interaction, client){
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles))
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Insufficient Permissions")
                        .setDescription("Ping an admin to report the user to click on this button")
                ],
                ephemeral: true
            })

        Model.findOne({ msg_id: interaction.message.id.toString() }, async (err, data) => {
            if(err) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Something went wrong")
                        .setDescription("Something went wrong when trying to pull up the data")
                ],
                ephemeral: true
            })
            
            const originalSender = await client.users.fetch(data.original_sender);
            const guild = await client.guilds.cache.get(data.original_server);
            const serverOwner = await client.users.fetch(guild.ownerId);

            serverOwner.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${originalSender.username} has been reported for cross server spam`)
                        .setDescription(originalSender.username + " has been reported after using `/send-message`\nMessage: " + data.content + "\n User ID: " + originalSender.id)
                        .setColor(0xdf2c14)
                ]
            })

            originalSender.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Your message has been reported")
                        .setDescription(`Your message has been reported. The Server Owner has been notified. Try not to spam again`)
                        .setColor(0xdf2c14)
                ]
            })

            await interaction.message.delete();

            await Model.deleteOne({ msg_id: interaction.message.id });
        })
    }
}