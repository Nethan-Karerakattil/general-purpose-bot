const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const fs = require("node:fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows the help command"),

    async execute(interaction, client){
        let helpMsg = new EmbedBuilder()
            .setTitle("Here are my commands")
            .setColor(0x4e5d94)
            .setFooter({ text: "Created By NASTYBOI#6205" });

        const commandFolders = fs.readdirSync("./src/commands/");
        for(const folder of commandFolders){
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`);
            let object = { name: folder, inline: true };

            for(const file of commandFiles){
                const command = require(`../${folder}/${file}`);

                if(object.value == undefined)
                    object.value = "`/" + command.data.name + "`: " + command.data.description + "\n";

                else object.value = object.value + "`/" + command.data.name + "`: " + command.data.description + "\n";
            }

            helpMsg.addFields(object)
        }

        await interaction.editReply({
            embeds: [ helpMsg ]
        })
    }
}