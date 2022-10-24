const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle }
    = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song")

        .addStringOption(option => option
            .setName("song")
            .setDescription("Song URL / Name"))
            
        .addStringOption(option => option
            .setName("playlist")
            .setDescription("Playlist URL")),

    async execute(interaction, client){
        const song = await interaction.options.getString("song");
        const playlist = await interaction.options.getString("playlist");

        if(!interaction.member.voice.channel) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("No Voice Channel Detected")
                    .setDescription("You must join a Voice Channel before writting the play command")
                    .setColor(0xdf2c14)
            ]
        })

        if(!song && !playlist) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Choose atleast one option")
                    .setDescription("You must choose atleast one option for the command to work")
                    .setColor(0xdf2c14)
            ]
        })

        const queue = await client.player.createQueue(interaction.guild.id);

        await queue.join(interaction.member.voice.channel);

        switch(interaction.options._hoistedOptions[0].name){
            case "song":
                await queue.play(interaction.options.getString("song"))
                    .catch(err => handleError(err))
                    .then(() => playMsg("song"));

                break;

            case "playlist":
                await queue.playlist(interaction.options.getString("playlist"))
                    .catch(err => handleError(err))
                    .then(() => playMsg("playlist"));

                break;
        }

        async function handleError(err){
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Something went wrong")
                        .setDescription("Something went wrong when trying to execute this command")
                        .setColor(0xdf2c14)
                ]
            })

            throw err;
        }

        async function playMsg(type){
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Added the ${type} to the queue`)
                        .setFooter({ text: "Created By Strange Cat#6205" })
                        .setColor(0x3ded97)
                ]
            })
        }

        queue.setData({
            getQueueMsg: async (queueMin, guildQueue) => {
                let embed = new EmbedBuilder()
                    .setFooter({ text: "Created By Strange Cat#6205" })
                    .setColor(0x4e5d94);
    
                for(let i = queueMin; i < queueMin + 10; i++){
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
                            .setCustomId("queue-full-backward")
                            .setLabel("⏮️")
                            .setStyle(ButtonStyle.Primary),
    
                        new ButtonBuilder()
                            .setCustomId("queue-backward")
                            .setLabel("◀️")
                            .setStyle(ButtonStyle.Primary),
    
                        new ButtonBuilder()
                            .setCustomId("queue-forward")
                            .setLabel("▶️")
                            .setStyle(ButtonStyle.Primary),
    
                        new ButtonBuilder()
                            .setCustomId("queue-full-forward")
                            .setLabel("⏭️")
                            .setStyle(ButtonStyle.Primary),
                    
                        new ButtonBuilder()
                            .setCustomId("queue-delete")
                            .setLabel("🗑️")
                            .setStyle(ButtonStyle.Danger)
                    )

                guildQueue.data.prevQueueMin = queueMin;

                return { embeds: [embed], components: [buttons] };
            },
            prevQueueMin: 0,
            originalChannel: interaction.channel
        })
    }
}