const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle }
    = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Provides a link which can be used to invite me to other servers"),

    async execute(interaction, client){
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("To Invite the bot, Follow these steps:-")
                    .setDescription("1. Click on the button at the bottom of the message\n2. Select which server you want to add the bot to\n3. Select which permissions you want the bot to have (Recommended to have all)\n4. Click on Authorize\n5. Verify that you are human")
                    .setColor(0x4e5d94)
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Click to Invite")
                            .setURL("https://discord.com/api/oauth2/authorize?client_id=916599817818497044&permissions=8&scope=bot")
                            .setStyle(ButtonStyle.Link)
                    )
            ]
        })
    }
}