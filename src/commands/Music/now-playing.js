const { EmbedBuilder, SlashCommandBuilder }  = require("discord.js");
const { execute } = require("./toggle-loop");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("now-playing")
        .setDescription("Shows the song that is currently playing"),

    async execute(interaction, client){
        if(!interaction.member.voice.channel) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("No Voice Channel Detected")
                    .setDescription("You must join a Voice Channel before writting the play command")
                    .setColor(0xdf2c14)
            ]
        })

        const guildQueue = client.player.getQueue(interaction.guild.id);

        if(!guildQueue?.data) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("You must use the Play Command")
                    .setDescription("You must use the Play Command before writting the now-playing command")
                    .setColor(0xdf2c14)
            ]
        })

        const progress = guildQueue.createProgressBar();
        progress.bar = `[${progress.bar.replace(/ /g, " .")}]`;

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Now Playing: ${guildQueue.songs[0].name}`)
                    .setDescription(`${progress.bar}[${progress.times}]`)
                    .setFooter({ text: "Created By Strange Cat#6205" })
                    .setColor(0x3ded97)
            ]
        })
    }
}