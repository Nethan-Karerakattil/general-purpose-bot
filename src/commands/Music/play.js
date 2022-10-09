const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

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
        if(!interaction.member.voice.channel) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("No Voice Channel Detected")
                    .setDescription("You must join a Voice Channel before writting the play command")
                    .setColor(0xdf2c14)
            ]
        })

        if(!interaction.options.getString("song") && !interaction.options.getString("playlist"))
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Choose atleast one option")
                        .setDescription("You must choose atleast one option for the command to work")
                        .setColor(0xdf2c14)
                ]
            })

        const queue = await client.player.createQueue(interaction.guild.id, { data: {
            playCommand: true,
            originalChannel: interaction.channel.id
        }});

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

            return console.log(err);
        }

        async function playMsg(type){
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Added the ${type} to the queue`)
                        .setFooter({ text: "Created By NASTYBOI#6205" })
                        .setColor(0x3ded97)
                ]
            })
        }
    }
}