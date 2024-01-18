const client = require("../index");
const { ApplicationCommandOptionType, Collection } = require("discord.js");
const { whiteList } = require('../settings/config')

client.on("interactionCreate", async (interaction) => {
    if (interaction.commandName == "game" && !Object.values(whiteList).some((role) => interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role))) {
        interaction.reply({ content: `You don't have the permission to use this command`, ephemeral: true });
        return;
    }
    if (interaction.isCommand()) {
        //await interaction.deferReply({ ephemeral: true }).catch(/* GRACEFAIL */); //turn on when there are errors !!! Change all interaction.reply() to interaction.followUp() !!!
        const cmdName = interaction.commandName;
        const cmd = client.commands.get(cmdName);
        if (!cmd) {
            interaction.reply({ content: `\`${cmdName}\` Command Not Found`, ephemeral: true });
            return;
        } else {
            const args = [];
            for (let option of interaction.options.data) {
                if (option.type === ApplicationCommandOptionType.Subcommand) {
                    if (option.name) args.push(option.name);
                    option.options?.forEach((x) => {
                        if (x.value) args.push(x.value);
                    });
                } else if (option.value) {
                    args.push(option.value);
                }
            }

            if (cooldown(interaction, cmd)) {
                interaction.reply(`You are On Cooldown, wait \`${cooldown(interaction, cmd).toFixed()}\` Seconds`);
                return;
            } else {
                cmd.run(client, interaction, args)
            }
        }
    }

    if (interaction.isContextMenuCommand()) {
        await interaction.deferReply({ ephemeral: true }).catch(/* GRACEFAIL */);
        const command = client.commands.get(interaction.commandName);
        if (command) command.run(client, interaction);
    }
});

function cooldown(interaction, cmd) {
    if (!interaction || !cmd) return;
    let { client, member } = interaction;
    if (!client.cooldowns.has(cmd.name)) {
      client.cooldowns.set(cmd.name, new Collection());
    }
    const now = Date.now();
    const timestamps = client.cooldowns.get(cmd.name);
    const cooldownAmount = cmd.cooldown * 1000;
    if (timestamps.has(member.id)) {
      const expirationTime = timestamps.get(member.id) + cooldownAmount;
      if (now < expirationTime) {
        return (expirationTime - now) / 1000;
      } else {
        timestamps.set(member.id, now);
        setTimeout(() => timestamps.delete(member.id), cooldownAmount);
        return false;
      }
    } else {
      timestamps.set(member.id, now);
      setTimeout(() => timestamps.delete(member.id), cooldownAmount);
      return false;
    }
  }
  