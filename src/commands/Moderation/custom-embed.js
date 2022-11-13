const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("custom-embed")
        .setDescription("Takes JSON input and/or plain text and returns a message")

        .addSubcommand(subcommand => subcommand
            .setName("json")
            .setDescription("Create an embed with JSON code")
            
            .addStringOption(option => option
                .setName("json-text")
                .setDescription("Valid JSON code")
                .setRequired(true))
                
            .addChannelOption(option => option
                .setName("channel")
                .setDescription("Channel to send the message to (Optional)")))
                
        .addSubcommand(subcommand => subcommand
            .setName("simple")
            .setDescription("Create an embed with Slash Command Options")
            
            .addStringOption(option => option
                .setName("content")
                .setDescription("Text to appear ontop of the embed"))

            .addStringOption(option => option
                .setName("title")
                .setDescription("A title for the embed"))

            .addStringOption(option => option
                .setName("url")
                .setDescription("URL to attach to the title"))

            .addStringOption(option => option
                .setName("description")
                .setDescription("Description for your embed"))

            .addStringOption(option => option
                .setName("thumbnail")
                .setDescription("Thumbnail for the embed"))

            .addStringOption(option => option
                .setName("image")
                .setDescription("Image for the embed"))

            .addStringOption(option => option
                .setName("author-name")
                .setDescription("Text for the author field"))

            .addStringOption(option => option
                .setName("author-url")
                .setDescription("URL for author section"))

            .addStringOption(option => option
                .setName("author-icon-url")
                .setDescription("Icon for the author section"))

            .addStringOption(option => option
                .setName("footer-text")
                .setDescription("Text for the footer section"))
            
            .addStringOption(option => option
                .setName("footer-icon-url")
                .setDescription("Icon for the footer section"))

            .addChannelOption(option => option
                .setName("channel")
                .setDescription("Channel to send the message to"))),

    async execute(interaction, client){
        switch(interaction.options.getSubcommand()){
            case "json":
                const json = interaction.options.getString("json-text");
                const chan = interaction.options.getChannel("channel") || interaction.channel;

                try{
                    await chan.send(JSON.parse(json))
                    .then(async () => {
                        await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Sent the message!")
                                    .setDescription(`The message has been sent to ${chan}`)
                            ]
                        })
                        .then(msg => setTimeout(() => msg.delete(), 10000))

                        await interaction.user.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Here are the values that you used in JSON format")
                                    .setDescription("```" + json + "```\nFor more options, we suggest using the JSON format")
                                    .setColor(0x4e5d94)
                            ]
                        })
                    })
                }
                catch(err){
                    await interaction.user.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Here are the values that you used in JSON format")
                                .setDescription("```" + json + "```")
                                .setColor(0x4e5d94)
                        ]
                    })

                    return await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Type Error")
                                .setDescription("```" + err + "```\nFor help, vist this --> https://birdie0.github.io/discord-webhooks-guide/structure/embeds.html")
                                .setColor(0xdf2c14)
                        ]
                    })
                }

                break;

            case "simple":
                const channel = interaction.options.getChannel("channel") || interaction.channel

                const object = {
                    content: interaction.options.getString("text"),
                    embeds: [
                        {
                            title: interaction.options.getString("title"),
                            url: interaction.options.getString("url"),
                            description: interaction.options.getString("description"),
                            thumbnail: {
                                url: interaction.options.getString("thumbnail")
                            },
                            image: {
                                url: interaction.options.getString("image")
                            },
                            author: {
                                name: interaction.options.getString("author-name"),
                                url: interaction.options.getString("author-url"),
                                icon_url: interaction.options.getString("author-icon-url")
                            },
                            footer: {
                                text: interaction.options.getString("footer-text"),
                                icon_url: interaction.options.getString("footer-icon-url")
                            }
                        }
                    ]
                }

                try{
                    await channel.send(object)
                    .then(async () => {
                        await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Sent the message!")
                                    .setDescription(`The message has been sent to ${channel}`)
                            ]
                        })
                        .then(msg => setTimeout(() => msg.delete(), 10000))

                        await interaction.user.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Here are the values that you used in JSON format")
                                    .setDescription("```" + JSON.stringify(object, undefined, 4) + "```\nFor more options, we suggest using the JSON format")
                                    .setColor(0x4e5d94)
                            ]
                        })
                    })
                }
                catch(err){
                    await interaction.user.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Here are the values that you used in JSON format")
                                .setDescription("```" + JSON.stringify(object, undefined, 4) + "```")
                                .setColor(0x4e5d94)
                        ]
                    })

                    return await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Type Error")
                                .setDescription("```" + err + "```")
                                .setColor(0xdf2c14)
                        ]
                    })
                }
        }
    }
}