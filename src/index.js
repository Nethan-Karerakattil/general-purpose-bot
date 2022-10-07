require("dotenv").config();

const { Client, Collection } = require("discord.js");
const fs = require("node:fs");

const client = new Client({ intents: 98045 });

client.commands = new Collection();
client.commandsArr = [];

const functionFolders = fs.readdirSync("./src/structures");
for(const folder of functionFolders){
    const functionFiles = fs.readdirSync(`./src/structures/${folder}`)
        .filter(file => file.endsWith(".js"));

    for(const file of functionFiles){
        require(`./structures/${folder}/${file}`)(client);
    }
}

client.handleEvents();
client.handleCommands();

client.login(process.env.token);