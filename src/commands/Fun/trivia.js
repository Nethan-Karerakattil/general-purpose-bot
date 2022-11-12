const Model = require("../../models/triviaModel");
const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle }
    = require("discord.js");

let answer;
let playersAnswered = [];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("trivia")
        .setDescription("Starts a game of trivia")
        
        .addIntegerOption(option => option
            .setName("rounds")
            .setDescription("Number of rounds to have (Required)")
            .setRequired(true))

        .addStringOption(option => option
            .setName("category")
            .setDescription("Type of questions to be asked (Required)")
            .setRequired(true)
                
            .addChoices(
                { name: "Arts & Literature", value: "arts_and_literature" },
                { name: "Film & TV", value: "film_and_tv" },
                { name: "Foods & Drinks", value: "food_and_drink" },
                { name: "General Knowledge", value: "general_knowledge" },
                { name: "Geography", value: "geography" },
                { name: "History", value: "history" },
                { name: "Music", value: "music" },
                { name: "Science", value: "science" },
                { name: "Culture & Society", value: "society_and_culture" },
                { name: "Sports & Leisure", value: "sport_and_leisure" }
            ))
            
        .addStringOption(option => option
            .setName("difficulty")
            .setDescription("Choose your difficulty (Required)")
            .setRequired(true)
            
            .addChoices(
                { name: "Easy", value: "easy" },
                { name: "Medium", value: "medium" },
                { name: "Hard", value: "hard" },
            )),

    async execute(interaction, client){
        const rounds = interaction.options.getInteger("rounds");
        const difficulty = interaction.options.getString("difficulty") || "medium";
        const category = interaction.options.getString("category");

        if(rounds <= 1) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Invalid Input")
                    .setDescription("The rounds must be greater than 1")
                    .setColor(0xdf2c14)
            ]
        })

        const url = `https://the-trivia-api.com/api/questions?categories=${category}&limit=${rounds}&difficulty=${difficulty}`;
        const response = await (await fetch(url)).json();

        //Send Join Message
        const message = await updateJoinMsg("1 Minute Remaining", 0x3ded97);
        // setTimeout(async () => await updateJoinMsg("30 Seconds Remaining", 0xffe800), 30000);
        // setTimeout(async () => await updateJoinMsg("10 Seconds Remaining", 0xdf2c14), 50000);

        //Insert data into database
        await new Model({
            msg_id: message.id,
            difficulty: difficulty,
            category: category,

            players: [],
            rounds: {
                total: rounds,
                completed: 0
            },
        }).save();

        //After 60 seconds, send the starting game message
        setTimeout(async () => {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Starting the game...")
                        .setDescription(`The game is starting soon!`)
                        .setColor(0x3ded97)
                ],
                components: []
            })

            //5 Seconds after that, load the 1st round
            setTimeout(async () => await loadRound(), 5000);
        }, 5000)

        async function updateJoinMsg(time, color){
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("🎉 Trivia! 🎉")
                        .setDescription(`${time}\n\n**__Game Rules:-__**\n**Rounds**: ${rounds}\n**Difficulty**: ${difficulty}\n**Category**: ${category}`)
                        .setColor(color)
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("trivia-join")
                                .setLabel("Join")
                                .setEmoji("🎉")
                                .setStyle(ButtonStyle.Success)
                        )
                ]
            })
        }

        async function loadRound(){
            playersAnswered = [];
            answer = Math.floor(Math.random() * 4);

            //Push answer into a random position in the incorrect answer array
            response[0].incorrectAnswers
                .splice(answer, 0, response[0].correctAnswer);

            //Send the question along with buttons
            updateMessage(25, 0x3ded97);
            setTimeout(async () => await updateMessage(15, 0xffe800), 10000);
            setTimeout(async () => await updateMessage(5, 0xdf2c14), 20000);

            //After 35 Seconds, Show the correct answer & who is on the lead
            setTimeout(async () => await showResults(), 25000);
        }

        async function updateMessage (time, color) {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${response[0].question}`)
                        .setDescription(`${time} Seconds Remaining`)
                        .setColor(color)

                        .addFields(
                            { name: "Option 1", value: response[0].incorrectAnswers[0] },
                            { name: "Option 2", value: response[0].incorrectAnswers[1] },
                            { name: "Option 3", value: response[0].incorrectAnswers[2] },
                            { name: "Option 4", value: response[0].incorrectAnswers[3] },
                        )
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("trivia-1")
                                .setLabel("Option 1")
                                .setStyle(ButtonStyle.Success),

                            new ButtonBuilder()
                                .setCustomId("trivia-2")
                                .setLabel("Option 2")
                                .setStyle(ButtonStyle.Success),
                            
                            new ButtonBuilder()
                                .setCustomId("trivia-3")
                                .setLabel("Option 3")
                                .setStyle(ButtonStyle.Success),

                            new ButtonBuilder()
                                .setCustomId("trivia-4")
                                .setLabel('Option 4')
                                .setStyle(ButtonStyle.Success)
                        )
                ]
            })
        }

        async function showResults(){
            //This function is used to generate buttons
            const buttons = [
                new ActionRowBuilder()
                    .addComponents(
                        generateButton(0),
                        generateButton(1),
                        generateButton(2),
                        generateButton(3),
                    )
            ]

            function generateButton(input){
                if(response[0].correctAnswer != response[0].incorrectAnswers[input])
                    return new ButtonBuilder()
                        .setCustomId(input.toString())
                        .setDisabled(true)
                        .setLabel(`Option ${input + 1}`)
                        .setStyle(ButtonStyle.Danger);

                return new ButtonBuilder()
                    .setCustomId(input.toString())
                    .setDisabled(true)
                    .setLabel(`Option ${input + 1}`)
                    .setStyle(ButtonStyle.Success);
            }

            //Remove Correct Answer from incorrect answers & display the leaderboard
            response[0].incorrectAnswers.splice(answer, 1);

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(response[0].question)
                        .setDescription(`**Correct Answer:-**\n    ${response[0].correctAnswer}\n\n**Other Options:-**\n1. ${response[0].incorrectAnswers[0]}\n2. ${response[0].incorrectAnswers[1]}\n3. ${response[0].incorrectAnswers[2]}`)
                        .setColor(0x3ded97)
                ],
                components: buttons
            })

            //remove the question from the response array
            response.shift();

            Model.findOne({ msg_id: message.id }, async (err, data) => {
                if(err) return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Something went wrong")
                            .setDescription("Something went wrong when trying to pull up the data")
                            .setColor(0xdf2c14)
                    ],
                    ephemeral: true
                })

                //increment the number of rounds completed
                data.rounds.completed++;
                await data.save();

                //Display the current Leaderboards
                let leaderboard = "";
                for(const player of data.players){
                    const user = client.users.cache.get(player.id);
                    leaderboard += `${user}: ${player.points}\n`;
                }

                setTimeout(async () => {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Current Leaderboard:-")
                                .setDescription(leaderboard)
                                .setColor(0x3ded97)
                        ],
                        components: []
                    })
                }, 5000)

                setTimeout(async () => {
                    if(data.rounds.completed === data.rounds.total) return completeGame();

                    //Load the next question
                    setTimeout(() => loadRound(), 2500);
                }, 10000)
            })
        }

        function completeGame() {
            Model.findOne({ msg_id: message.id }, async (err, data) => {
                if(err) return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Something went wrong")
                            .setDescription("Something went wrong when trying to pull up the data")
                            .setColor(0xdf2c14)
                    ]
                })

                if(data == null) return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Something went wrong")
                            .setDescription("No data was found")
                            .setColor(0xdf2c14)
                    ]
                })

                let description = "**Leaderboard:-**\n";
                for(const player of data.players){
                    const user = client.users.cache.get(player.id);
                    description += `${user}: ${player.points}\n`;
                }

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Game Complete!")
                            .setDescription(description)
                            .setColor(0x3ded97)
                            .setFooter({ text: "Created By Strange Cat#6205" })
                    ]
                })

                await data.delete();
            })
        }
    },

    async handleClicks(interaction, client, buttonID){
        Model.findOne({ msg_id: interaction.message.id }, async (err, data) => {
            if(err) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Something went wrong")
                        .setDescription("Something went wrong when trying to pull up the data")
                        .setColor(0xdf2c14)
                ],
                ephemeral: true
            })

            if(!data) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Something went wrong")
                        .setDescription("I was unable to pull up the data")
                        .setColor(0xdf2c14)
                ],
                ephemeral: true
            })

            for(let i = 0; i < data.players.length; i++){
                if(playersAnswered.includes(data.players[i].id))
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("You have already played")
                                .setDescription("You cannot change your answer or choose another option")
                        ],
                        ephemeral: true
                    })

                if(data.players[i].id === interaction.member.id)
                    return handleSuccess(i);
            }

            async function handleSuccess(i){
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`You have choosen option ${buttonID + 1}`)
                            .setColor(0x3ded97)
                    ],
                    ephemeral: true
                })

                if(buttonID == answer){
                    data.players[i].points += Math.ceil(Math.random() * 5) + 10;
                    await data.save();
                }

                playersAnswered.push(interaction.member.id);
            }
        })
    }
}