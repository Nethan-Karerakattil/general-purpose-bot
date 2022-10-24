const giveawayModel = require("../../models/giveawayModel");
const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, time, PermissionsBitField }
    = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("start-giveaway")
        .setDescription("Starts a Giveaway")

        .addNumberOption(option => option
            .setName("days")
            .setDescription("Number of Days for giveaway to end (Required)")
            .setRequired(true))

        .addStringOption(option => option
            .setName("prize")
            .setDescription("Prize for the winner (Required)")
            .setRequired(true))

        .addNumberOption(option => option
            .setName("winners")
            .setDescription("Number of winners (Required)")
            .setRequired(true))
            
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("Channel in which giveaway is to be hosted (Optional)")),

    async execute(interaction, client){
        const days = interaction.options.getNumber("days");
        const prize = interaction.options.getString("prize");
        const winners = interaction.options.getNumber("winners");
        const channel = interaction.options.getChannel("channel") || interaction.channel;

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Insufficient Permissions")
                        .setDescription("You do not have the permission to Moderate Members")
                        .setColor(0xdf2c14)
                ]
            })

        if(days >= 15) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Time is too big")
                    .setDescription("Time must be below 15 days")
                    .setColor(0xdf2c14)
            ]
        })

        const date = new Date(days * 86400000 + (Date.now()));

        const reply = await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("🎉 Giveaway Started! 🎉")
                    .setColor(0x3ded97)
            ]
        })

        setTimeout(async () => {
            await reply.delete();
        }, 10000)

        const message = await channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(prize)
                    .setDescription(`Ends: ${time(date)}\nHosted By: ${interaction.member}\nEntries: 0\nWinners: ${winners}`)
                    .setColor(0x4e5d94)

                    .setFooter({ text: "Created By NASTYBOI#6205" })
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("giveaway-join")
                            .setLabel("🎉")
                            .setStyle(ButtonStyle.Success),
                    )
            ]
        })

        const giveaway = new giveawayModel({
            msg_id: message.id,
            joinedUsers: []
        })

        giveaway.save();

        setTimeout(() => {
            giveawayModel.findOne({ msg_id: message.id }, async (err, data) => {
                if(err) {
                    console.log(err);

                    return await message.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Something went wrong")
                                .setDescription("Something went wrong when trying to end the Giveaway")
                        ]
                    })
                }

                handleSuccess(data);
            })
        }, days * 8645)

        async function handleSuccess(data){
            const { joinedUsers } = data;
            const winner = await interaction.guild.members.fetch(
                joinedUsers[Math.floor(Math.random(joinedUsers.length))]
            );

            await message.edit({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(prize)
                        .setDescription(`Ended: ${time(date)}\nHosted By: ${interaction.member}\nEntries: ${joinedUsers.length}\nWinners: ${winners}`)
                        .setColor(0x3ded97)
                ]
            })

            await winner.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`You won the ${prize} in ${interaction.guild.name}`)
                        .setColor(0x3ded97)
                ]
            })

            await giveawayModel.deleteOne({ msg_id: message.id })
        }
    }
}