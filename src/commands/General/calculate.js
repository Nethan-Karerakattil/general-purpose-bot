const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("calculate")
        .setDescription("Calculates 2 numbers")

        .addNumberOption(option => option
            .setName("first-number")
            .setDescription("The first number of the expression")
            .setRequired(true))

        .addNumberOption(option => option
            .setName("second-number")
            .setDescription("The second number of the expression")
            .setRequired(true))

        .addStringOption(option => option
            .setName("operation")
            .setDescription("operation to use")
            .setRequired(true)
            
            .addChoices(
                { name: "Addition", value: "+" },
                { name: "Substraction", value: "-" },
                { name: "Division", value: "/" },
                { name: "Multiplication", value: "x" }
            )),

    async execute(interaction, client){
        const termOne = interaction.options.getNumber("first-number");
        const termTwo = interaction.options.getNumber("second-number");
        const operation = interaction.options.getString("operation");

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`${termOne} ${operation} ${termTwo} = ${calculate()}`)
                    .setColor(0x3ded97)
            ]
        })

        function calculate(){
            switch(operation){
                case "+":
                    return termOne + termTwo;
                
                case "-":
                    return termOne - termTwo;

                case "/":
                    return termOne / termTwo;

                case "x":
                    return termOne * termTwo;
            }
        }
    }
}