const Josh = require("@joshdb/core");
const provider = require("@joshdb/json");

/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {

    client.active = new Josh({
        name: "active",
        provider: provider,
        providerOptions: {
            dataDir: "./settings/data/"
        }
    });

    client.on("guildDelete", async (guild) => {
        if (!guild) return;
        let server = await client.active.get(guild.id);
        if (!server) return;
        await client.active.delete(guild.id);
    });
};
