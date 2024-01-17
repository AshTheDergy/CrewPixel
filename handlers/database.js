const Josh = require("@joshdb/core");
const provider = require("@joshdb/json");

/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {

    client.all = new Josh({
        name: "all",
        provider: provider,
    });

};
