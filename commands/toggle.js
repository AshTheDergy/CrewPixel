// Typedef
/**
 * @typedef {import('../handlers/client')} SUS
 * @typedef {import("discord.js").CommandInteraction} CommandInteraction
 */

const voiceState = new Map()
module.exports = {
    name: "toggle",
    description: "mute and unmute the members in the voice channel",
    cooldown: 1,

    /**
    * @param {SUS} client
    * @param {CommandInteraction} interaction
    */

    run: async (client, interaction) => {
        if (await client.active?.masters?.member.has(interaction.user.id) ||
            !Object.values(client.config.whiteList).some((role) =>
            interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role))) {
            interaction.reply({ content: `You Do Not Have The Permissions To Use This Command`, ephemeral: true });
            return;
        }
        if (await client.active.get(interaction.guildId)) {
            if (!interaction.member.voice.channel.permissionsFor(client.user).has('MUTE_MEMBERS')) {
                interaction.reply('I don\'t have the necessary permissions to mute/unmute members in this channel.');
                return;
            }
            if (!interaction.member.voice.channel) {
                interaction.reply({ content: `You must be in a voice channel to use this command.`, ephemeral: true });
                return;
            }
            if (interaction.member.voice.channelId != await client.active.vc) {
                interaction.reply({ content: `You must be in the correct voice channel to use this command.`, ephemeral: true });
                return;
            }

            const voiceChannel = client.active.vc;
            await toggleState(interaction.guildId, voiceState.get(interaction.guildId), voiceChannel)
            
            interaction.reply({ content: `Good luck!`, ephemeral: true });
        } else {
            interaction.reply({ content: `There are no active events.`, ephemeral: true });
        }
    }
}

async function toggleState(guild, state, vc) {
    if (!client.voiceState || state == 2) {
        voiceState.set(guild, 1);
        vc.members.forEach(m => {
            m.voice.setMute(true);
        });
    } else if (state == 1) {
        voiceState.set(guild, 2);
        vc.members.forEach(m => {
            m.voice.setMute(false);
        });
    }
    setTimeout(() => voiceState.delete(guild), 900 * 1000)
}
