const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle }
    = require("discord.js");

module.exports = {
    data: {
        name: "skip-yes"
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

        const guildQueue = client.player.getQueue(interaction.guild.id);
        guildQueue.data.skipData.currentVotes++;

        const { currentVotes, skipMinVote } = guildQueue.data;

        if(currentVotes != skipMinVote) return await interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Vote to Skip (${currentVotes}/${skipMinVote})`)
                    .setDescription(`Votes Needed: ${skipMinVote}\nNumber Of Votes: ${currentVotes}`)
                    .setColor(0x4e5d94)
            ]
        })

        await guildQueue.skip();

        await interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Skipped the Song")
                    .setFooter({ text: "Created By NASTYBOI#6205" })
                    .setColor(0x3ded97)
            ],
            components: []
        })
    }
}