const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const Model = require("../../models/ticTacToeModel");

module.exports = {
    data: new SlashCommandBuilder() 
        .setName("tic-tac-toe")
        .setDescription("Play a game of tic tac toe with someone")

        .addUserOption(option => option
            .setName("user")
            .setDescription("User to play tic tac toe with")),

    async execute(interaction, client){
        const user = interaction.options.getUser("user");

        if(user.id === interaction.member.id) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Invalid User")
                    .setDescription("Its surprising how stupid you are. You cant play tic tac toe with yourself")
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
                    .setTitle("🎲 Player 1's Turn 🎲")
                    .setColor(0x3ded97)
            ],
            components: initialComponents
        })

        const data = new Model({
            message_id: message.id,

            player_1: interaction.member.id,
            player_2: user.id,

            turn: 1,
            board: [
                { stat: 0 }, { stat: 0 }, { stat: 0 },
                { stat: 0 }, { stat: 0 }, { stat: 0 },
                { stat: 0 }, { stat: 0 }, { stat: 0 },
            ]
        })

        data.save();
    },

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

            if(data.board[buttonID].stat != 0) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Invalid Move")
                        .setDescription("Someone already played that spot bro .-.")
                        .setColor(0xdf2c14)
                ],
                ephemeral: true
            })
            let embedTitle;

            if(interaction.member.id === data.player_1) {
                if(data.turn == 2) return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Its not your turn")
                            .setDescription("The other player is still thinking. Wait for him to make a move")
                            .setColor(0xdf2c14)
                    ]
                })
                
                data.board[buttonID].stat = 1;
                data.turn = 2;
                await data.save();

                embedTitle = "🎲 Player 2's Turn 🎲";
            }

            if(interaction.member.id == data.player_2){
                if(data.turn == 1) return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Its not your turn")
                            .setDescription("The other player is still thinking. Wait for him to make a move")
                            .setColor(0xdf2c14)
                    ],
                    ephemeral: true
                })

                data.board[buttonID].stat = 2;
                data.turn = 1;
                await data.save();

                embedTitle = "🎲 Player 2's Turn 🎲";
            }

            const checkPlayer1Victory = await checkWinner(data.board, 1);
            if(checkPlayer1Victory == "tie") return await interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("🎉 Tie! 🎉")
                        .setColor(0x3ded97)
                ],
                components: []
            })

            if(checkPlayer1Victory) return await interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("🎉 Player 1 Won! 🎉")
                        .setColor(0x3ded97)
                ],
                components: []
            })

            const checkPlayer2Victory = await checkWinner(data.board, 2);
            if(checkPlayer2Victory) return await interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("🎉 Player 2 Won! 🎉")
                        .setColor(0x3ded97)
                ],
                components: []
            })

            return reloadMessage(embedTitle, data, interaction);
        })

        async function checkWinner(arr, p){
            //Check for winner in sleeping rows
            for(let i = 0; i < 6; i += 3){
                if(arr[i].stat == p && arr[i + 1].stat == arr[i].stat && arr[i + 2].stat == arr[i].stat){
                    return true;
                }
            }
          
            //Check for winner in standing rows
            for(let i = 0; i < 3; i++){
                if(arr[i].stat == p && arr[i + 3].stat == arr[i].stat && arr[i + 6].stat == arr[i].stat){
                    return true
                }
            }
            
            //Check for winner in inclined rows
            if(arr[0].stat == p && arr[4].stat == arr[0].stat && arr[8].stat == arr[4].stat){
                return true
            }
            
            if(arr[2].stat == p && arr[4].stat == arr[2].stat && arr[6].stat == arr[4].stat){
                return true
            }

            //Check For Tie
            for(let i = 0; i < 9; i++){
                if(arr[i].stat == 0) break;
                if(i == 8){
                    return "tie";
                };
            }

            return false;
        }

        async function reloadMessage(title, data, interaction){
            let components = [];

            function checkBtnStat(num){
                if(data.board[num].stat == 0) return new ButtonBuilder()
                    .setCustomId(`tic-tac-${num + 1}`)
                    .setEmoji("⬜")
                    .setStyle(ButtonStyle.Primary);
    
                if(data.board[num].stat == 1) return new ButtonBuilder()
                    .setCustomId(`tic-tac-${num + 1}`)
                    .setEmoji("⭕")
                    .setStyle(ButtonStyle.Success);
    
                if(data.board[num].stat == 2) return new ButtonBuilder()
                    .setCustomId(`tic-tac-${num + 1}`)
                    .setEmoji("❌")
                    .setStyle(ButtonStyle.Danger);
            }
    
            for(let i = 0; i < 9; i += 3){
                components.push(
                    new ActionRowBuilder()
                        .addComponents(
                            checkBtnStat(i),
                            checkBtnStat(i + 1),
                            checkBtnStat(i + 2)
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
        }
    }
}