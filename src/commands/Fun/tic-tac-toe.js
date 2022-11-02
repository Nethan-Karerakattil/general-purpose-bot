const Model = require("../../models/ticTacToeModel");
const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle }
    = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder() 
        .setName("tic-tac-toe")
        .setDescription("Play a game of tic tac toe with someone")

        .addUserOption(option => option
            .setName("user")
            .setDescription("User to play tic tac toe with")),

    async execute(interaction, client){
        const user = interaction.options.getUser("user");

        if(user?.id === interaction.member.id) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Invalid User")
                    .setDescription("Its surprising how stupid you are. You cant play tic tac toe with yourself")
                    .setColor(0xdf2c14)
            ]
        })

        let initialComponents = [];
        for(let i = 1; i < 9; i += 3){
            initialComponents.push(
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`tic-tac-${i}`)
                            .setEmoji("⬜")
                            .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                            .setCustomId(`tic-tac-${i + 1}`)
                            .setEmoji("⬜")
                            .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                            .setCustomId(`tic-tac-${i + 2}`)
                            .setEmoji("⬜")
                            .setStyle(ButtonStyle.Primary),
                )
            );
        }

        const message = await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`🎲 ${interaction.user.username}'s Turn 🎲`)
                    .setColor(0x3ded97)
            ],
            components: initialComponents
        })

        const timeout = setTimeout(async () => {
            Model.findOne({ message_id: message.id }, async (err, data) => {
                if(err) return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Something went wrong")
                            .setDescription("Something went wrong when trying to end the game")
                            .setColor(0xdf2c14)
                    ]
                })

                const player1 = await client.users.fetch(data.player1);
                const player2 = await client.users.fetch(data.player2);

                if(data.turn == 1) return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`🎉 ${player1.username} Won By Default 🎉`)
                            .setDescription(`${player2.username} did not respond in time`)
                            .setColor(0x3ded97)
                    ],
                    components: []
                })

                if(data.turn == 2) return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`🎉 ${player2.username} Won By Default 🎉`)
                            .setDescription(`${player1.username} did not respond in time`)
                            .setColor(0x3ded97)
                    ],
                    components: []
                })
            })

            data.deleteOne({ message_id: message.id });
        }, 60000)

        const data = new Model({
            message_id: message.id,
            timeout_id: timeout,

            player1: interaction.user.id,
            player2: user?.id || "bot",

            turn: 1,
            board: [0, 0, 0, 0, 0, 0, 0, 0, 0]
        })

        await data.save();
    },

    //Executed on Button Click
    async hanldeClicks(interaction, client, buttonID){
        Model.findOne({ message_id: interaction.message.id }, async (err, data) => {
            if(err) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Something went wrong")
                        .setDescription("Something went wrong when trying to pull up the data")
                        .setColor(0xdf2c14)
                ],
                ephemeral: true
            })

            clearTimeout(data.timeout_id);

            const player1 = await client.users.fetch(data.player1);
            let player2 = "bot";

            if(data.player2 != "bot") player2 = await client.users.fetch(data.player2);

            //Check if someone already played that spot
            if(data.board[buttonID] != 0) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Invalid Move")
                        .setDescription("Someone already played that spot bro .-.")
                        .setColor(0xdf2c14)
                ],
                ephemeral: true
            })

            let embedTitle;

            if(data.turn == 1 && interaction.member.id == data.player1){
                //Update board on Database
                data.board[buttonID] = 1;
                data.turn = 2;

                //Check Winner
                if(checkWinner(data.board, 1) === true)
                    return endGame(`🎉 ${player1.username} Won! 🎉`, data);

                embedTitle = `🎲 ${player2.username || "Bot"}'s Turn 🎲`;
            }

            else if(data.turn == 2 && interaction.member.id == data.player2){
                //Update board
                data.board[buttonID] = 2;
                data.turn = 1;

                //Check if player 2 has won
                if(checkWinner(data.board, 2) === true)
                    return endGame(`🎉 ${player2.username || "Bot"} Won! 🎉`, data);

                embedTitle = `🎲 ${player1.username}'s Turn 🎲`;
            }

            //If it is anything else, it must mean that the wrong person clicked on the button
            else return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Its not your turn")
                        .setDescription("It is the other user's turn. Wait for them to make a move")
                        .setColor(0xdf2c14)
                ],
                ephemeral: true
            })

            if(player2 === "bot"){
                let newPos;
                generatePos();

                function generatePos(){
                    newPos = Math.floor(Math.random() * 8);
                }

                while(data.board[newPos] != 0) generatePos();

                setTimeout(async () => {
                    data.board[newPos] = 2;
                    data.turn = 1;

                    //Check if the bot has won
                    if(checkWinner(data.board, 2) === true){
                        let components = [];
                        for(let i = 0; i < 9; i += 3){
                            components.push(
                                new ActionRowBuilder()
                                    .addComponents(
                                        checkBtnStat(i, data, true),
                                        checkBtnStat(i + 1, data, true),
                                        checkBtnStat(i + 2, data, true)
                                )
                            );
                        }

                        await data.deleteOne({ message_id: interaction.message.id });

                        return await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("🎉 Bot Won! 🎉")
                                    .setColor(0x3ded97)
                            ],
                            components: components
                        })
                    }

                    let components = [];
                    for(let i = 0; i < 9; i += 3){
                        components.push(
                            new ActionRowBuilder()
                                .addComponents(
                                    checkBtnStat(i, data, false),
                                    checkBtnStat(i + 1, data, false),
                                    checkBtnStat(i + 2, data, false)
                            )
                        );
                    }

                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`🎲 ${player1.username}'s Turn 🎲`)
                                .setColor(0x3ded97)
                        ],
                        components: components
                    })

                    await data.save();
                }, 1500)
            }
            
            //Check if there is a tie
            const player1Tie = checkWinner(data.board, 1);
            const player2Tie = checkWinner(data.board, 2);
            if(player1Tie === "tie" && player2Tie === "tie")
                return endGame("🎉 Tie! 🎉", data);

            //Nothing has been triggered! Continue the game
            return reloadMessage(embedTitle, data, interaction);
        })

        function checkWinner(arr, p){
            //Check for winner in sleeping rows
            for(let i = 0; i < 7; i += 3){
                if(arr[i] == p && arr[i + 1] == arr[i] && arr[i + 2] == arr[i]){
                    return true;
                }
            }
          
            //Check for winner in standing rows
            for(let i = 0; i < 3; i++){
                if(arr[i] == p && arr[i + 3] == arr[i] && arr[i + 6] == arr[i]){
                    return true;
                }
            }
            
            //Check for winner in inclined rows
            if(arr[0] == p && arr[4] == arr[0] && arr[8] == arr[4]){
                return true;
            }
            
            if(arr[2] == p && arr[4] == arr[2] && arr[6] == arr[4]){
                return true;
            }

            //Check For Tie
            for(let i = 0; i < 9; i++){
                if(arr[i] == 0) break;
                if(i == 8){
                    return "tie";
                };
            }

            return false;
        }

        async function reloadMessage(title, data, interaction){
            let components = [];
            for(let i = 0; i < 9; i += 3){
                components.push(
                    new ActionRowBuilder()
                        .addComponents(
                            checkBtnStat(i, data, false),
                            checkBtnStat(i + 1, data, false),
                            checkBtnStat(i + 2, data, false)
                    )
                );
            }

            await interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(title)
                        .setColor(0x3ded97)
                ],
                components: components
            })

            const timeout = setTimeout(async () => {
                const player1 = await client.users.fetch(data.player1);
                let player2 = "bot";

                if(data.player2 != "bot") player2 = await client.users.fetch(data.player2);
    
                if(data.turn == 1) return await interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`🎉 ${player1.username} Won By Default 🎉`)
                            .setDescription(`${player2.username} did not respond in time`)
                            .setColor(0x3ded97)
                    ],
                    components: []
                })
    
                if(data.turn == 2) return await interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`🎉 ${player2.username} Won By Default 🎉`)
                            .setDescription(`${player1.username} did not respond in time`)
                            .setColor(0x3ded97)
                    ],
                    components: []
                })

                data.deleteOne({ message_id: interaction.message.id });
            }, 60000)

            data.timeout_id = timeout;
            data.save();
        }

        function checkBtnStat(num, data, disabled){
            if(data.board[num] == 0) return new ButtonBuilder()
                .setCustomId(`tic-tac-${num + 1}`)
                .setEmoji("⬜")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(disabled);

            if(data.board[num] == 1) return new ButtonBuilder()
                .setCustomId(`tic-tac-${num + 1}`)
                .setEmoji("⭕")
                .setStyle(ButtonStyle.Success)
                .setDisabled(disabled);

            if(data.board[num] == 2) return new ButtonBuilder()
                .setCustomId(`tic-tac-${num + 1}`)
                .setEmoji("❌")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(disabled);
        }

        async function endGame(result, data){
            Model.deleteOne({ message_id: interaction.message.id }, async err => {
                if(err){
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Something went wrong")
                                .setDescription("Something went wrong when trying to end the game")
                                .setColor(0xdf2c14)
                        ],
                        components: []
                    })

                    return console.log(err);
                }
            })

            let components = [];
            for(let i = 0; i < 9; i += 3){
                components.push(
                    new ActionRowBuilder()
                        .addComponents(
                            checkBtnStat(i, data, true),
                            checkBtnStat(i + 1, data, true),
                            checkBtnStat(i + 2, data, true)
                    )
                );
            }

            await interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(result)
                        .setColor(0x3ded97)
                ],
                components: components
            })

            await Model.deleteOne({ message_id: interaction.message.id });
        }
    }
}