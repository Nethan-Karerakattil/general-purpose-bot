const fs = require("node:fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const config = require("../../../config");

module.exports = client => {
    client.handleCommands = async () => {
        const commandFolders = fs.readdirSync("./src/commands");
        for(const folder of commandFolders){
            const commandFile = fs.readdirSync(`./src/commands/${folder}`)

            for(const file of commandFile){
                const command = require(`../../commands/${folder}/${file}`);

                client.commands.set(command.data.name, command);
                client.commandsArr.push(command.data.toJSON());
            }
        }

        const rest = new REST({ version: 9 }).setToken(process.env.token);

        try{
            const data = await rest.put(Routes.applicationCommands(config.client_id), {
                body: client.commandsArr
            })

            console.log(`[ Refreshed ${data.length} application commands ]`);
        }catch(err){
            console.error(err);
        }
    }
}