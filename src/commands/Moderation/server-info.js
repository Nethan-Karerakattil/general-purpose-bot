const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("server-info")
        .setDescription("Shows server stats"),

    async execute(interaction, client){
        const { guild } = interaction;

        const createdAt = new Date(guild.createdAt);
        const date = `${createdAt.getDate()}/${createdAt.getMonth()}/${createdAt.getFullYear()}`;
        const time = `${createdAt.getHours()}:${createdAt.getMinutes()}:${createdAt.getSeconds()}`;

        const owner = await guild.fetchOwner();
        const rulesChannel = client.channels.cache.get(guild.rulesChannelId)

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Server Info for ${guild.name}`)
                    .setImage(guild.iconURL())
                    .setColor(0x4e5d94)

                    .addFields(
                        {
                            name: "Owner",
                            value: owner.toString(),
                            inline: true
                        },
                        {
                            name: "Members",
                            value: guild.memberCount.toString(),
                            inline: true
                        },
                        {
                            name: "NSFW Level",
                            value: guild.nsfwLevel.toString(),
                            inline: true
                        },
                        {
                            name: "Rules Channel",
                            value: rulesChannel.name || "No Rules Channel",
                            inline: true
                        },
                        {
                            name: "Created At",
                            value: date + " " + time,
                            inline: true
                        },
                        {
                            name: "Vanity URL",
                            value: `${guild.vanityURLCode || "No Vanity URL"}`,
                            inline: true
                        },
                        {
                            name: "Large",
                            value: guild.large.toString(),
                            inline: true
                        },
                        {
                            name: "Partnered",
                            value: guild.partnered.toString(),
                            inline: true
                        },
                        {
                            name: "Verified",
                            value: guild.verified.toString(),
                            inline: true
                        }
                    )

                    .setFooter({ text: "Created By Strange Cat#6205" })
            ]
        })

    }
}