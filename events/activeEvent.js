const client = require("../index");
const { cooldownUser, voiceUpdate } = require('../handlers/functions');
const leftMuted = new Map();

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild || !message.id) return;
    if (message.content == `<@${client.user.id}>` && await client.active.get(message.guild.id) && !cooldowns.get(message.author.id)) {
        const data = await client.active.get(message.guild.id);
        message.reply({
            content: `## There is an Active Among Us Event!!!\nJoining code: **\`${data.code}\`**\nJoin us in vc: <#${data.vc}>`
        });
        Object.values(client.config.whiteList).some((role) => message.guild.members.cache.get(message.author.id).roles.cache.has(role)) ? void(0) : cooldownUser(message.author.id, 30)
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    const voiceState = await voiceUpdate();
    if (oldState.channel && !newState.channel && voiceState.get(oldState.channel.id) == oldState.guild.id) {
        oldState.member.send(`**You left the vc while being muted!!**\nYou have to join any vc (except the event ones) to remove your mute`);
        leftMuted.set(oldState.member.id, true);
        return;
    } else if (!newState.serverMute && newState.guild.id == voiceState.get(newState?.channel?.id)) {
        newState.member.voice.setMute(true).catch(console.error);
        return;
    } else if (newState.serverMute && newState.guild.id != voiceState.get(newState.channel.id) && oldState.channel != newState.channel) {
        newState.member.voice.setMute(false).catch(console.error);
        return;
    } else if (voiceState.get(newState?.channel?.id) != newState.guild.id && leftMuted.get(newState.member.id)) {
        newState.member.voice.setMute(false).catch(console.error);
        leftMuted.delete(newState.member.id);
        return;
    }
});
