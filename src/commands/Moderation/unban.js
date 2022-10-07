const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unbans a member")

        .addStringOption(option => option
            .setName("user-id")
            .setDescription("User id of the member to unban")),

        async execute(interaction, client){
            const { member, guild } = interaction;

            const user = interaction.options.getString("user-id");
            const target = await client.users.fetch(user);

            if(!member.permissions.has(PermissionsBitField.Flags.BanMembers))
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Insufficient Permissions")
                            .setDescription("You do not have the permission to unban members")
                    ]
                })

            try{
                await guild.members.unban(user);
            }catch(err){
                if(err.rawError.message === "Unknown Ban") return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Unknown Ban")
                            .setDescription("The person who you were trying to unban is not banned")
                    ]
                })

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Unknown Error")
                            .setDescription("Something went wrong when trying to execute this command")
                    ]
                })

                throw err;
            }
            
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Unbanned ${target.tag}`)
                        .setFooter({ text: "Created By NASTYBOI#6205" })
                        .setColor(0x3ded97)
                ]
            })
        }
}