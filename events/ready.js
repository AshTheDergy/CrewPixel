const { ActivityType } = require("discord.js");
const client = require("../index");

client.on("ready", async () => {
    console.log(`Client online: ${client.user.username}`);
    client.user.setActivity({
        name: `sussy mongus`,
        type: ActivityType.Playing,
    });

    await require("../handlers/database")(client);
});  
