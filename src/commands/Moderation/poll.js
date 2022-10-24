const pollModel = require("../../models/pollModel");
const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle }
    = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Create a Poll")

        .addStringOption(option => option
            .setName("question")
            .setDescription("Question for the Poll (Required)")
            .setRequired(true))

        .addNumberOption(option => option
            .setName("days")
            .setDescription("Days for poll to end in (Required)")
            .setRequired(true))

        .addStringOption(option => option
            .setName("option-1")
            .setDescription("1st Option (Required)")
            .setRequired(true))

        .addStringOption(option => option
            .setName("option-2")
            .setDescription("2nd Option (Required)")
            .setRequired(true))

        .addStringOption(option => option
            .setName("option-3")
            .setDescription("3rd Option (Optional)"))

        .addStringOption(option => option
            .setName("option-4")
            .setDescription("4th Option (Optional)")),

    async execute(interaction, client){
        const question = interaction.options.getString("question");
        const time = interaction.options.getNumber("days");

        if(time <= 15) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Time is too big")
                    .setDescription("Time must be below 15 days")
            ],
            ephemeral: true
        })

        let initialMessage = new EmbedBuilder()
            .setTitle(question)
            .setColor(0x4e5d94);

        let initialButton = new ActionRowBuilder();

        let pollData = {
            server_id: interaction.guild.id.toString(),
            question: question,
            options: []
        }
        

        for(let i = 1; i < 5; i++){
            const option = interaction.options.getString(`option-${i}`)
            if(!option) break;

            initialMessage.addFields({
                name: `Option ${i}`,
                value: option
            })

            initialButton.addComponents(
                new ButtonBuilder()
                    .setCustomId(`poll-option-${i}`)
                    .setLabel(i.toString())
                    .setStyle(ButtonStyle.Primary),
            )

            pollData.options.push({
                name: option,
                votes: []
            })
        }

        const message = await interaction.editReply({
            embeds: [ initialMessage ],
            components: [ initialButton ]
        })

        pollData.msg_id = message.id;

        new pollModel(pollData).save();

        setTimeout(async () => {
            pollModel.findOne({ msg_id: message.id }, async (err, data) => {
                if(err) return handleError(err);

                handleSuccess(data);
            })
        }, time * 86400000);

        async function handleError(err){
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Something went wrong")
                        .setDescription("Something went wrong when trying to end the Poll")
                ]
            })

            await pollModel.deleteOne({ msg_id: message.id });

            console.log(err);
        }

        async function handleSuccess(data){
            let successEmbed = new EmbedBuilder()
                .setTitle("Poll Ended!")
                .setDescription(question)
                .setFooter({ text: "Created By Strange Cat#6205" })

            for(const option of data.options){
                successEmbed.addFields({ name: option.name, value: `Votes: ${option.votes.length}` })
            }

            await interaction.editReply({
                embeds: [ successEmbed ],
                components: []
            })

            await pollModel.deleteOne({ msg_id: message.id });
        }
    }
}