const Model = require("../../models/crossServerMessage");
const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle }
    = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("send-message")
        .setDescription("Send a message to another server")

        .addStringOption(option => option
            .setName("server-name")
            .setDescription("Name of the server (Required)")
            .setAutocomplete(true)
            .setRequired(true))

        .addStringOption(option => option
            .setName("channel-name")
            .setDescription("Name of the channel (Required)")
            .setAutocomplete(true)
            .setRequired(true))
            
        .addStringOption(option => option
            .setName("message")
            .setDescription("Message to send")
            .setRequired(true)),

    async execute(interaction, client){
        const channel = await client.channels.cache.get(interaction.options.getString("channel-name"));
        const message = await interaction.options.getString("message");

        if(message.includes("@")) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Invalid Charector")
                    .setDescription("You cannot use the @ charector in your message")
                    .setColor(0xdf2c14)
            ]
        })

        if(message.length > 50) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Too many charactors")
                    .setDescription("The message is too long")
                    .setColor(0xdf2c14)
            ]
        })

        const sentMessage = await channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${interaction.user.username} says: ${message}`)
                    .setDescription(`**Message came from:-**\nServer Name: ${interaction.guild.name}\nChannel Name: ${interaction.channel.name}`)
                    .setFooter({ text: "Created By Strange Cat#6205" })
                    .setColor(0x4e5d94)
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("message-report")
                            .setLabel("Report")
                            .setStyle(ButtonStyle.Danger)
                    )
            ]
        })

        const model = new Model({
            content: message,
            msg_id: sentMessage.id,

            original_sender: interaction.user.id,
            original_server: interaction.guild.id
        }).save();

        setTimeout(async () => {
            await sentMessage.edit({
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("message-report")
                                .setLabel("Report")
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(true)
                        )
                ]
            })

            await model.delete();
        }, 259200000)

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Successful!")
                    .setDescription("You sent the message")
                    .setFooter({ text: "Created By Strange Cat#6205" })
                    .setColor(0x3ded97)
            ]
        })
    },

    async autocomplete(interaction, client){
        const option = interaction.options.getFocused(true);
        let choices = [];

        if(option.name === "server-name"){
            for(const guild of client.guilds.cache){
                if(choices.length == 10) break;
                if(guild[1].name.toLowerCase().startsWith(option.value.toLowerCase()))
                    choices.push([guild[1].name, guild[1].id]);
            }
        }

        if(option.name === "channel-name"){
            const serverID = interaction.options.getString("server-name");
            const channels = client.guilds.cache.get(serverID).channels.cache.values();

            for(const channel of channels){
                if(channel.isVoiceBased() || !channel.isTextBased()) continue;
                if(choices.length > 10) break;
                if(channel.name.toLowerCase().startsWith(option.value.toLowerCase()))
                    choices.push([channel.name, channel.id]);
            }
        }

        await interaction.respond(
            choices.map(choice => ({ name: choice[0], value: choice[1] })),
        );
    }
}