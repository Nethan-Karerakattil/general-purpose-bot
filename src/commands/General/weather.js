require("dotenv").config();
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const https = require("node:https")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("weather")
        .setDescription("Gets the weather of a place")

        .addSubcommand(subcommand => subcommand
            .setName("city")
            .setDescription("Find weather with City Name")
            
            .addStringOption(option => option
                .setName("city-name")
                .setDescription("Name of the city (Required)")
                .setRequired(true)))
                
        .addSubcommand(subcommand => subcommand
            .setName("coordinates")
            .setDescription("Find weather with Coordinates")
            
            .addStringOption(option => option
                .setName("latitude")
                .setDescription("Latitude of the location (Required)")
                .setRequired(true))
                
            .addStringOption(option => option
                .setName("longitude")
                .setDescription("Longitude of the location (Required)")
                .setRequired(true))),

    async execute(interaction, client){
        switch(interaction.options.getSubcommand()){
            case "city":
                const city = interaction.options.getString("city-name");
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OWM_key}`;
        
                run(url);
            break;
            case "coordinates":
                const lat = interaction.options.getString("latitude");
                const lon = interaction.options.getString("longitude");
                const uri = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OWM_key}`;
            
                run(uri);
            break;
        }

        async function run(url){
            let data = "";
            const request = https.request(url, resp => {
                resp.on("data", chunk => data += chunk.toString());
                resp.on("end", async () => {
                    data = JSON.parse(data);

                    if(data.cod === "404") return await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("No city found")
                                .setDescription("Un-fortunatly this city doesnt exist or is not being tracked by the API")
                                .setColor(0xdf2c14)
                        ]
                    })
                    
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`${data.weather[0].description} in ${data.name}, ${data.sys.country}`)
                                .setDescription(`**Temperature:** ${data.main.temp}°C\n**Feels Like:** ${data.main.feels_like}°C\n**Pressure:** ${data.main.pressure}Pa\n**Humidity:** ${data.main.humidity}%`)
                                .setThumbnail(`http://openweathermap.org/img/w/${data.weather[0].icon}.png`)
                                .setFooter({ text: "Created By Strange Cat#6205" })
                                .setColor(0x4e5d94)
                        ]
                    })
                });
            })

            request.on("error", async err => {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Something went wrong")
                            .setDescription("Something went wrong when trying to pull up the data")
                    ]
                })

                return console.log(err);
            })

            request.end();
        }
    }
}