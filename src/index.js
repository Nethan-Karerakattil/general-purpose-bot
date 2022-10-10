require("dotenv").config();

const { Client, Collection } = require("discord.js");
const fs = require("node:fs");
const { player, Player } = require("discord-music-player");
const mongoose = require("mongoose");

const client = new Client({ intents: 98045 });
mongoose.connect("mongodb://localhost:27017/general-purpose-bot");

client.commands = new Collection();
client.player = new Player(client);
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