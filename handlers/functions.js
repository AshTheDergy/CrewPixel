const voiceState = new Map();
const cooldowns = new Map();

function cooldownUser(user, time) {
    cooldowns.set(user, Date.now() + time * 1000);
    setTimeout(() => cooldowns.delete(user), time * 1000);
}

async function toggleMute(i, guild, vc) {
    if (voiceState.get(vc.id, guild)) {
        voiceState.delete(vc.id, guild);
        vc.members.forEach(m => {
            m.voice.setMute(false);
        });
        i.reply({ content: `Sussy baki`, ephemeral: false });
    } else {
        voiceState.set(vc.id, guild);
        vc.members.forEach(m => {
            m.voice.setMute(true);
        });
        i.reply({ content: `Survive...`, ephemeral: false });
    }
}

async function voiceUpdate() {
    return voiceState;
}

module.exports = { cooldownUser, toggleMute, voiceUpdate }