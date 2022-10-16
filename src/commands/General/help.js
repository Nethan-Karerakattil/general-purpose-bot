const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const fs = require("node:fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows the help command"),

    async execute(interaction, client){
        let initialMessage = new EmbedBuilder()
            .setTitle("Here are my Commands!")
            .setColor(0x4e5d94)
            .setFooter({ text: "Created By NASTYBOI#6205" })

        const folders = fs.readdirSync("./src/commands");
        for(const folder of folders){
            const files = fs.readdirSync(`./src/commands/${folder}`);
            let value = "";

            for(const file of files){
                value = value + "`/" + file.replace(".js", "") + "` ";
            }

            initialMessage.addFields({ name: folder, value: value });
        }

        await interaction.editReply({
            embeds: [ initialMessage ]
        })
    }
}