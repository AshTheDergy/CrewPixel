// Typedef
/**
 * @typedef {import('../handlers/client')} SUS
 * @typedef {import("discord.js").CommandInteraction} CommandInteraction
 */

module.exports = {
    name: "mute",
    description: "mute the members in the voice channel",
    cooldown: 1,

    /**
    * @param {SUS} client
    * @param {CommandInteraction} interaction
    */

    run: async (client, interaction) => {
        if (await client.active?.masters?.member.has(interaction.user.id) || !Object.values(client.config.whiteList).some((role) => interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role))) {
            interaction.reply({ content: `You Do Not Have The Permissions To Use This Command`, ephemeral: true });
            return;
        }
        if (await client.active.get(interaction.guildId)) {
            if (!interaction.member.voice.channel) {
                interaction.reply({ content: `You must be in a voice channel to use this command.`, ephemeral: true });
                return;
            }
            if (!interaction.member.voice.channel.permissionsFor(client.user).has('MUTE_MEMBERS')) {
                interaction.reply('I don\'t have the necessary permissions to mute/unmute members in this channel.');
                return;
            }

            interaction.member.voice.channel.members.forEach(m => {
                m.voice.setMute(true)
            });
            interaction.reply({ content: `Good luck!`, ephemeral: true });
        } else {
            interaction.reply({ content: `There are no active events.`, ephemeral: true });
        }
    }
}