const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("list-roles")
        .setDescription("Shows you all of the roles inside this server"),

    async execute(interaction, client){
        let str = "";
        await interaction.guild.roles.cache
            .forEach(role => str += `${role} `);

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Roles in the guild:-")
                    .setColor(0x3ded97)
                    .setDescription(str)
            ]
        })
    }
}