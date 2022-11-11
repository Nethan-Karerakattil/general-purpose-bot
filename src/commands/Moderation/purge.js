const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Mass delete messages")

        .addIntegerOption(option => option
            .setName("number-of-messages")
            .setDescription("Number of messages to delete")
            .setRequired(true))
            
        .addBooleanOption(option => option
            .setName("only-old")
            .setDescription("Purge messages that are only more than 2 weeks old (Optional)")),

    async execute(interaction, client){
        const { member } = interaction;

        if(!member.permissions.has(PermissionsBitField.Flags.ManageChannels))
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Insufficient Permissions")
                        .setDescription("You do not have the Administrator Permission")
                        .setColor(0xdf2c14)
                ]
            })

        const messages = interaction.options.getInteger("number-of-messages");
        const oldOnly = interaction.options.getBoolean("only-old") || false;

        if(messages >= 100) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Invalid Input")
                    .setDescription("The Messages cannot be more than or equal to 100")
                    .setColor(0xdf2c14)
            ]
        })

        await interaction.channel.bulkDelete(messages, [ oldOnly ]);

        await interaction.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Purged ${messages} Messages`)
                    .setFooter({ text: "Created By Strange Cat#6205" })
                    .setColor(0x3ded97)
            ]
        })
    }
}