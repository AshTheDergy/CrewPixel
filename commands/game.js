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
            options: [
                {
                    name: "event",
                    description: "Select which event to end",
                    type: 7,
                    channel_types: [2],
                    required: true,
                }
            ],
        },
        {
            name: "master",
            description: "Select more game masters for the currently active event(s)",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "Select a user to add to the list",
                    type: 6,
                    required: true,
                },
                {
                    name: "event",
                    description: "Select which event to end",
                    type: 7,
                    channel_types: [2],
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
        await interaction.deferReply({ ephemeral: true }).catch(/* GRACEFAIL */);
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case "start":
                var gameCode = interaction.options.getString("code");
                var voiceChannel = interaction.options.getChannel("vc");
                var master = interaction.options.getUser("master");
                var correctCode = /^[a-zA-Z]{6}$/;

                if (await client.active.get(`${interaction.guildId}.${voiceChannel.id}`)) {
                    interaction.followUp({ content: `There is already an active event in this channel. Use \`/game end\` to end the event.`, ephemeral: true });
                } else if (correctCode.test(gameCode)) {
                    var data = {
                        code: gameCode.toUpperCase(),
                        vc: voiceChannel.id,
                        masters: {
                            role: client.config.whiteList,
                            member: [],
                        }
                    }
                    if (master) data.masters.member = [master.id];
                    client.active.set(`${interaction.guild.id}.${voiceChannel.id}`, data);
                    await voiceChannel.setName(`[mogus] ${voiceChannel.name}`);
                    await voiceChannel.setUserLimit(15);
                    interaction.followUp({ content: `Event started with code \`${gameCode.toUpperCase()}\`\nGame master: ${master ? `\`${master.username}\`` + ", `Event staff`, `Admins`" : "`Event staff`, `Admins`"}\nVC: <#${voiceChannel.id}>`, ephemeral: true }); //for discord.gg/furcade
                } else {
                    interaction.followUp({ content: `${gameCode} is not a valid code.`, ephemeral: true });
                }
                break;
            case "end":
                var event = interaction.options.getChannel("event");
                if (await client.active.get(`${interaction.guildId}.${event.id}`)) {
                    client.active.delete(`${interaction.guildId}.${event.id}`);
                    await event.setName(event.name.replace('[mogus]', ''));
                    await event.setUserLimit(0);
                    interaction.followUp({ content: `Event has been ended.`, ephemeral: true });
                } else {
                    interaction.followUp({ content: `There are no active events in this channel.`, ephemeral: true });
                }
                break;
            case "master":
                var user = interaction.options.getUser("user");
                var event = interaction.options.getChannel("event");
                if (!client.active.get(`${interaction.guildId}.${event.id}`)) {
                    interaction.followUp({ content: `There are no active events in this channel.`, ephemeral: true });
                } else {
                    client.active.push(`${interaction.guildId}.${event.id}.masters.member`, interaction.user.id);
                    interaction.followUp({ content: `User ${user} has been added to the game masters.`, ephemeral: true });
                }
                break;
        }
    }
}