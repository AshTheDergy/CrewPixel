// Typedef
/**
 * @typedef {import('../handlers/client')} SUS
 * @typedef {import("discord.js").CommandInteraction} CommandInteraction
 */
module.exports = {
    name: "game",
    description: "game options",
    userPermissions: ['SEND_MESSAGES'],
    botPermissions: ["EMBED_LINKS"],
    cooldown: 1,
    options: [
        {
            name: "start",
            description: "Start an among us event. Not selecting game master will default to Event Staff and Admins", // for discord.gg/furcade
            type: 1,
            options: [
                {
                    name: "code",
                    description: "Among us game code",
                    type: 3,
                    required: true,
                },
                {
                    name: "vc",
                    description: "Among us event vc",
                    type: 7,
                    channel_types: [2],
                    required: true,
                },
                {
                    name: "master",
                    description: "Select a game master - People who can control the vc mute/unmute",
                    type: 6,
                    required: false,
                }
            ],
        },
        {
            name: "end",
            description: "End an among us event",
            type: 1, 
        },
        {
            name: "master",
            description: "Select more game masters for the currently active event",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "Select a user to add to the list",
                    type: 6,
                    required: true,
                }
            ],
        },
    ],

    /**
    * @param {SUS} client
    * @param {CommandInteraction} interaction
    */

    run: async (client, interaction) => {
        
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case "start":

                const gameCode = interaction.options.getString("code");
                const voiceChannel = interaction.options.getChannel("vc");
                const master = interaction.options.getUser("master");
                const correctCode = /^[a-zA-Z]{6}$/;

                if (await client.active.get(interaction.guildId)) {
                    interaction.reply({ content: `There is already an active event. Use \`/game end\` to end the event.`, ephemeral: true });
                } else if (correctCode.test(gameCode)) {
                    const data = {
                        code: gameCode.toUpperCase(),
                        vc: voiceChannel.id,
                        masters: {
                            role: client.config.whiteList,
                            member: [],
                        },
                    }
                    if (master) data.masters.member = [master.id];
                    await client.active.set(interaction.guildId, data);
                    interaction.reply({ content: `Event started with code \`${gameCode.toUpperCase()}\`\nGame master: ${master ? `\`${master.username}\`` + ", `Event staff`, `Admins`" : "`Event staff`, `Admins`"}`, ephemeral: true }); //for discord.gg/furcade
                } else {
                    interaction.reply({ content: `${gameCode} is not a valid code.`, ephemeral: true });
                }
                break;
            case "end":
                if (await client.active.get(interaction.guildId)) {
                    client.active.delete(interaction.guildId);
                    interaction.reply({ content: `Event has been ended.`, ephemeral: true });
                } else {
                    interaction.reply({ content: `There are no active events.`, ephemeral: true });
                }
                break;
            case "master":
                const user = interaction.options.getUser("user")
                if (!client.active.get(interaction.guildId)) {
                    interaction.reply({ content: `There are no active events.`, ephemeral: true });
                } else {
                    client.active.push(`${interaction.guildId}.masters.member`, interaction.user.id);
                    interaction.reply({ content: `User ${user} has been added to the game masters.`, ephemeral: true });
                }
                break;
        }
    }
}