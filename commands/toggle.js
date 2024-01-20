// Typedef
/**
 * @typedef {import('../handlers/client')} SUS
 * @typedef {import("discord.js").CommandInteraction} CommandInteraction
 */

const { toggleMute } = require('../handlers/functions')

module.exports = {
    name: "toggle",
    description: "mute and unmute the members in the voice channel",
    cooldown: 1,

    /**
    * @param {SUS} client
    * @param {CommandInteraction} interaction
    */

    run: async (client, interaction) => {
        if (await client.active.get(interaction.guild.id)) {
            if (!interaction.member.voice.channel.permissionsFor(client.user).has('MUTE_MEMBERS')) {
                interaction.reply({ content:'I don\'t have the necessary permissions to mute/unmute members in this channel.', ephemeral:true });
                return;
            }
            if (!interaction.member.voice.channel) {
                interaction.reply({ content: `You must be in a voice channel to use this command.`, ephemeral: true });
                return;
            }
            if (await client.active.get(`${interaction.guild.id}.${interaction.member.voice.channel.id}`).masters?.member.has(interaction.user.id) ||
            !Object.values(client.config.whiteList).some((role) =>
            interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role))) {
                interaction.reply({ content: `You Do Not Have The Permissions To Use This Command`, ephemeral: true });
                return;
            }
            if (interaction.member.voice.channel.id != await client.active.get(`${interaction.guild.id}.${interaction.member.voice.channel.id}.vc`)) {
                interaction.reply({ content: `You must be in the correct voice channel to use this command.`, ephemeral: true });
                return;
            }

            const guild = interaction.guild.id;
            const vc = interaction.member.voice.channel
            await toggleMute(interaction, guild, vc)
        } else {
            interaction.reply({ content: `There are no active events.`, ephemeral: true });
        }
    }
}