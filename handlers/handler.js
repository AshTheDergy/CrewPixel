// Typedef
/**
 * @typedef {import('../../handlers/Client')} SUS
 */

// Imports
const { readdirSync } = require("fs");
const { ApplicationCommandType } = require("discord.js");

/**
 * @param {PH} client
 */
module.exports = async (client) => {

    try {
        let allCommands = [];
        const commands = readdirSync(`/commands/${dir}`).filter((f) =>
            f.endsWith(".js")
        );

        for (const cmd of commands) {
            const command = require(`./commands/${cmd}`);
            if (command.name) {
                command.type = ApplicationCommandType.ChatInput;
                client.commands.set(command.name, command);
                allCommands.push(command);
            } else {
            console.log(`${cmd} is not ready`);
            }
        }
        console.log(`Commands loaded: ${client.commands.size}`);
        client.on("ready", async () => {
            await client.application.commands.set(allCommands);
        });
    } catch (e) {
        console.log(e);
    }

  // Loading Event Files
    try {
        readdirSync("./events")
        .filter((f) => f.endsWith(".js"))
        .forEach((event) => {
        require(`../events/${event}`);
        });
    } catch (e) {
        console.log(e);
    }
};
