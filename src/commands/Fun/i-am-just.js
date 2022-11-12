const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("i-am-just")
        .setDescription("Just something to use if you want to know more about me C:"),

    async execute(interaction, client){
        const doing = [
            "complaining about",
            "ranting about",
            "rhyming over",
            "telling stories about",
            "stating factoids about",
            "drawing conclusions on",
            "misspelling",
            "inventing words about",
            "simulating",
            "simulating",
            "asking questions about",
            "pretending to know about",
            "drawing landscapes inspired by",
            "reciting poems about",
            "regurgitating quotes about",
            "predicting the future of",
            "telling tales of",
            "speculating about",
            "musing over",
            "spreading lies about",
            "composing haikus about",
            "tweeting about anything but",
            "linking to Wiki-pages about",
            "giving instructions about",
            "making fun of",
            "shouting about",
            "describing",
            "confusing",
            "disregarding",
            "ignoring",
            "lecturing on",
            "bickering over",
            "blaming",
            "calling out",
            "challenging",
            "contemplating",
            "criticising",
            "flirting with",
            "listing",
            "crying about",
            "caring for",
            "defining",
            "sacking"
        ]

        const something = [
            "politics",
            "the weather",
            "art",
            "the Web",
            "cats",
            "climate change",
            "history",
            "the economy",
            "Brexit",
            "geography",
            "banks",
            "sports",
            "science-fiction",
            "nature",
            "animals",
            "big data",
            "technology",
            "robocars",
            "people",
            "the good old days",
            "money",
            "time",
            "jobs",
            "taxes",
            "immigrants",
            "locals",
            "tourists",
            "genders",
            "genres"
        ]

        const somehow = [
            "calmly",
            "formally",
            "with animated gifs",
            "pedantically",
            "continuously",
            "with gusto",
            "with emojis",
            "shamefully",
            "programmatically",
            "informally",
            "with dingbats",
            "critically",
            "inappropriately",
            "actively",
            "passive-agressively",
            "precisely",
            "patiently",
            "impulsively",
            "decisevely",
            "naively",
            "logically",
            "irrationally",
            "erratically",
            "with humour",
            "with noise",
            "privately",
            "quietly",
            "practically",
            "sarcastically",
            "ironically",
            "romantically",
            "with a cool cat"
        ]

        const randomDoing = doing[Math.floor(Math.random() * doing.length)];
        const randomSomething = something[Math.floor(Math.random() * something.length)];
        const randomSomehow = somehow[Math.floor(Math.random() * somehow.length)];

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`A Bot ${randomDoing} ${randomSomething}, ${randomSomehow}`)
                    .setURL("https://matteomenapace.github.io/random-generator-generator/")
                    .setColor(0x4e5d94)
                    .setFooter({ text: "Created by Strange Cat#6205" })
            ]
        })
    }
}