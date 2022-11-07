const { SlashCommandBuilder, EmbedBuilder, time } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("get-time")
        .setDescription("Helps with adding time")

        .addIntegerOption(option => option
            .setName("years")
            .setDescription("Number of years to add to the date"))

        .addIntegerOption(option => option
            .setName("months")
            .setDescription("Number of months to add to the date"))

        .addIntegerOption(option => option
            .setName("days")
            .setDescription("Number of days to add to the date"))

        .addIntegerOption(option => option
            .setName("hours")
            .setDescription("Number of hours to add to the date"))
        
        .addIntegerOption(option => option
            .setName("minutes")
            .setDescription("Number of minutes to add to the date"))

        .addIntegerOption(option => option
            .setName("seconds")
            .setDescription("Number of minutes to add to the date")),

    async execute(interaction, client){
        const date = new Date(Date.now());

        date.setSeconds(date.getSeconds() + interaction.options.getInteger("seconds") || 0);
        date.setMinutes(date.getMinutes() + interaction.options.getInteger("minutes") || 0);
        date.setHours(date.getHours() + interaction.options.getInteger("hours") || 0);
        date.setDate(date.getDate() + interaction.options.getInteger("days") || 0);
        date.setMonth(date.getMonth() + interaction.options.getInteger("months") || 0);
        date.setFullYear(date.getFullYear() + interaction.options.getInteger("years") || 0);

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**${time(date)}**`)
                    .setFooter({ text: "Created By Strange Cat#6205" })
                    .setColor(0x3ded97)
            ]
        })
    }
}