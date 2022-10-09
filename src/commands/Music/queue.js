const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle }
    = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows the Queue"),

    async execute(interaction, client){
        if(!interaction.member.voice.channel) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("No Voice Channel Detected")
                    .setDescription("You must join a Voice Channel before executing this command")
            ]
        })

        const guildQueue = client.player.getQueue(interaction.guild.id);

        if(!guildQueue?.data) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("You must use the Play Command")
                    .setDescription("You must use the Play Command before writting the Queue Command")
            ]
        })

        let embed = new EmbedBuilder()
            .setFooter({ text: "Created By NASTYBOI#6205" })
            .setColor(0x3ded97);

        for(let i = 0; i < 11; i++){
            if(!guildQueue.songs[i]) break;

            if(i == 0)
                embed.setTitle(`__Currently Playing__: ${guildQueue.songs[i].name}`)
                .setDescription(`${guildQueue.songs[i].duration}\n------------------------------------------------------------`)
        
            else embed.addFields({
                name: `${i}. ${guildQueue.songs[i].name}`,
                value: guildQueue.songs[i].duration
            })
        }

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("full-backward")
                    .setLabel("⏮️")
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId("backward")
                    .setLabel("◀️")
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId("forward")
                    .setLabel("▶️")
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId("full-forward")
                    .setLabel("⏭️")
                    .setStyle(ButtonStyle.Primary),
                
                new ButtonBuilder()
                    .setCustomId("delete")
                    .setLabel("🗑️")
                    .setStyle(ButtonStyle.Danger)
            )

        await interaction.editReply({
            embeds: [ embed ],
            components: [ buttons ]
        })
    }
}