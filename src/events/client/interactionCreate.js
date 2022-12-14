const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client){
        if(interaction.isChatInputCommand()){
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
    
            if(!commandName) return;
    
            try{
                const message = await interaction.deferReply({
                    fetchReply: true
                });
    
                await command.execute(interaction, client, message);
            }catch(err){
                console.error(err);
    
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Something went wrong")
                            .setDescription("Something went wrong when trying to execute this interaction")
                    ]
                })
            }
        }else if (interaction.isButton()) {
            const { buttons } = client;
            const { customId } = interaction;
            const button = buttons.get(customId);

            if(!button) return console.log("There is no code for this button");

            try{
                await button.execute(interaction, client);
            }catch(err){
                console.log(err);

                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Something went wrong.")
                            .setDescription("Something went wrong when trying to execute this interaction")
                    ],
                    ephemeral: true
                })
            }
        }else if (interaction.isAutocomplete()){
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);

            if (!command) return console.log("No match found");
    
            try {
                await command.autocomplete(interaction, client);
            } catch (error) {
                return console.log(error);
            }
        }
    }
}