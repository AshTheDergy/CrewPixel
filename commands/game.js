// Typedef
/**
 * @typedef {import('../handlers/client')} SUS
 * @typedef {import("discord.js").CommandInteraction} CommandInteraction
 */

module.exports = {
    name: "game",
    description: "Game options",
    cooldown: 1,
    options: [
        {
            name: "start",
            description: "Start an among us event",
            type: 1,
            options: [
                {
                    name: "code",
                    description: "Among us game code",
                    type: 3,
                }
            ],
        }
    ],

    /**
    * @param {SUS} client
    * @param {CommandInteraction} interaction
    */

    run: async (client, interaction) => {

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {

            case "start":
                
        }
    }
}