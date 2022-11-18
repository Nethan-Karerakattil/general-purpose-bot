const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("8-ball")
        .setDescription("Literally just a rip off of dank memer's 8ball ( Sorry Dank devs C: )")

        .addStringOption(option => option
            .setName("question")
            .setDescription("A question to get an answer to")
            .setRequired(true)),

    async execute(interaction, client){
        const question = interaction.options.getString("question");

        const responses = [
            "Yes",
            "Meow ( yes in cat language )",
            "Mr. Clean sempai approves 👍",
            "Floppa sempai approves 👍",
            "My answer will be the same to the question: Are cats cute?",
            "Today ends with a y so ill do it 💪",
            'Your wish is my command',
            "はい",
            "I would love to say no, but my dog told me to say yes C:",
            "Totally!",

            "no",
            "I would love to say yes, but my dog told me to say no C:",
            "I would, but i am a cat",
            "I would rather swallow a pillow",
            "Sorry man, not today :(. My friend's cousin's sister's dog just died",
            "Mr. Clean sempai would be disapointed in me if I said yes",
            "Floppa sempai approves 👍. I believe in Floppa Supremacy!",
            "Sorry man, dont want to be involved with FBI",
            "Can cats fly ( No they cant )",
            "Sorry man, I do not do that on days that end with y"
        ]

        const response = responses[Math.floor(Math.random() * responses.length)];

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(response)
                    .setDescription(`Question: ${question}`)
                    .setColor(0x4e5d94)
            ]
        })
    }
}