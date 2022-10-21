const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle }
    = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips a song"),

    async execute(interaction, client){
        const { guild, member } = interaction;

        if(!member.voice.channel) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("No Voice Channel Detected")
                    .setDescription("You must join a Voice Channel before writting the skip command")
                    .setColor(0xdf2c14)
            ]
        })

        const guildQueue = await client.player.getQueue(guild.id);

        if(!guildQueue?.data) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("You must use the Play Command")
                    .setDescription("You must use the Play Command before writting the skip command")
                    .setColor(0xdf2c14)
            ]
        })

        const vcSize = member.voice.channel.members.size - 1;
        const skipMinVote = Math.floor(vcSize * 0.666666);

        if(vcSize == 1) {
            await guildQueue.skip();

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Skipped the Song")
                        .setFooter({ text: "Created By NASTYBOI#6205" })
                        .setColor(0x3ded97)
                ]
            })
        }

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Vote to Skip (0/${skipMinVote})`)
                    .setDescription(`Votes Needed: ${skipMinVote}\nNumber Of Votes: 0`)
                    .setColor(0x4e5d94)
            ],

            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("skip-yes")
                            .setLabel("✅")
                            .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                            .setCustomId("skip-mod-override")
                            .setLabel("Override")
                            .setStyle(ButtonStyle.Danger),
                    )
            ]
        })

        guildQueue.data.skipData = {
            skipMinVote: skipMinVote,
            currentVotes: 0
        }
    }
}