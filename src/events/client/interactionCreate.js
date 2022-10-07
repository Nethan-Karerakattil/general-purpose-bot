const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client){
        const { commands } = client;
        const { commandName } = interaction;
        const command = commands.get(commandName);

        if(!commandName) return;

        try{
            await interaction.deferReply();

            await command.execute(interaction, client);
        }catch(err){
            console.error(err);

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Something went wrong")
                        .setDescription("Something went wrong when trying to execute this command")
                ],
                ephemeral: true
            })
        }
    }
}