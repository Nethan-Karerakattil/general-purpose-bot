const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { execute } = require("./clear-warnings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("slowmode")
        .setDescription("Adds a Slowmode to a Channel")

        .addIntegerOption(option => option
            .setName("slowmode")
            .setDescription("New slowmode in Seconds")
            .setRequired(true))

        .addChannelOption(option => option
            .setName("channel")
            .setDescription("Channel to add slowmode to (Leave blank if current channel)"))
            
        .addStringOption(option => option
            .setName("reason")
            .setDescription("Reason for adding slowmode (Optional)")),

    async execute(interaction, client){
        const { member, guild } = interaction;

        const targetChannel = interaction.options.getChannel("channel") || interaction.channel;
        const reason = interaction.options.getString("reason") || "Not Provided";
        const slowmode = interaction.options.getInteger("slowmode");

        if(!member.permissions.has(PermissionsBitField.Flags.ManageChannels))
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Insufficient Permissions")
                        .setDescription("You do not have the Manage Channels Permission")
                        .setColor(0xdf2c14)
                ]
            })

        targetChannel.setRateLimitPerUser(slowmode, [ reason ]);

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`New Slowmode is ${slowmode}`)
                    .setDescription(`New Slowmode: ${slowmode}\nChannel: ${targetChannel}\nReason: ${reason}`)
            ]
        })
    }
}