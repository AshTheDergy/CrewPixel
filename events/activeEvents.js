const client = require("../index");
const cooldowns = new Map();

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

function cooldownUser(user, time) {
    cooldowns.set(user, Date.now() + time * 1000);
    setTimeout(() => cooldowns.delete(user), time * 1000);
}