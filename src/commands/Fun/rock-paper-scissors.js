const Model = require("../../models/rockPaperModel");
const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle }
    = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rock-paper-scissors")
        .setDescription("Play Rock Paper Scissors with yourself or a bot")

        .addUserOption(option => option
            .setName("user")
            .setDescription("User to play Rock Paper Scissors with (Optional)")),

    async execute(interaction, client){
        const user = interaction.options.getUser("user") || "Bot";
        
        if(user?.id === interaction.member.id) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Invalid User")
                    .setDescription("You cannot play with yourself")
                    .setColor(0xdf2c14)
            ]
        })

        const message = await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("✂ Rock Paper Scissors ✂")
                    .setDescription(`${interaction.user}: Thinking...\n${user}: Thinking...`)
                    .setColor(0x4e5d94)
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`rps-rock`)
                            .setLabel("Rock")
                            .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                            .setCustomId("rps-paper")
                            .setLabel("Paper")
                            .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                            .setCustomId("rps-scissors")
                            .setLabel("Scissors")
                            .setStyle(ButtonStyle.Primary)
                    )
            ]
        })

        new Model({
            msg_id: message.id,

            player1: [ interaction.member.id, null ],
            player2: [ user?.id || "bot", null ],
        }).save();
    },

    handleClicks(interaction, client, buttonID){
        Model.findOne({ msg_id: interaction.message.id }, async (err, data) => {
            if(err) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Something went wrong")
                        .setDescription("Something went wrong when trying to pull up the data")
                ],
                ephemeral: true
            })

            if(data.player1[0] === interaction.member.id){
                data.player1[1] = buttonID;
                next(data);
            }
            if(data.player2[0] === interaction.member.id){
                data.player2[1] = buttonID;
                next(data);
            }

            await data.save();
        })

        async function next(data){
            const player1 = await client.users.fetch(data.player1[0]);
            const player2 = await client.users.fetch(data.player2[0]);

            if(data.player1[1] != null && data.player2[1] != null) {
                const diff = data.player1[1] - data.player2[1];

                if(diff == 0)
                    return sendSuccess(`🎉 Tie! 🎉`, data, player1, player2);
                if(diff == -1 || diff == 2)
                    return sendSuccess(`🎉 ${player2.username} Won! 🎉`, data, player1, player2)
                if(diff == 1 || diff == -2)
                    return sendSuccess(`🎉 ${player1.username} Won! 🎉`, data, player1, player2)
            }

            if(interaction.member.id === data.player1[0]) return await interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("✂ Rock Paper Scissors ✂")
                        .setDescription(`${player1}: Ready!\n${player2}: Thinking...`)
                        .setColor(0x4e5d94)
                ]
            })

            if(interaction.member.id === data.player2[0]) return await interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("✂ Rock Paper Scissors ✂")
                        .setDescription(`${player1}: Thinking...\n${player2}: Ready!`)
                        .setColor(0x4e5d94)
                ]
            })
        }

        async function sendSuccess(title, data, player1, player2){
            const map = new Map([
                [0, "Rock"],
                [1, "Paper"],
                [2, "Scissors"],
            ])

            const player1Move = map.get(data.player1[1]);
            const player2Move = map.get(data.player2[1]);

            await interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(title)
                        .setDescription(`${player1.username}: ${player1Move}\n${player2.username}: ${player2Move}`)
                        .setColor(0x3ded97)
                        .setFooter({ text: "Created By Strange Cat#6205" })
                ],
                components: []
            })
        }
    }
}