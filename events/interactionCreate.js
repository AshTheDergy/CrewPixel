const client = require("../index");
const { cooldown } = require("../handlers/functions");
const { ApplicationCommandOptionType } = require("discord.js");
const { whiteList } = require('../settings/config')

client.on("interactionCreate", async (interaction) => {
    if (!Object.values(whiteList).some((role) => interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role))) {
        interaction.reply({ content: `You Do Not Have The Permissions To Use This Bot`, ephemeral: true });
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
})