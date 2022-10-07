const { ActivityType } = require("discord.js");

module.exports = {
    name: "ready",
    once: true,

    async execute(client){
        client.user.setPresence({ activities: [{
            name: "Nichijou",
            type: ActivityType.Watching
        }], status: 'dnd' });

        console.log(`[ Logged in as ${client.user.tag}]`);
    }
}