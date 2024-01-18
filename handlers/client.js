const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const Discord = require('discord.js')
const fs = require("fs");

class SUS extends Client {
  constructor() {
    super({
      partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
      ],
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
      shards: "auto",
      failIfNotExists: false,
      allowedMentions: {
        parse: ["everyone", "roles", "users"],
        users: [],
        roles: [],
        repliedUser: false,
      },
    });

    this.events = new Collection();
    this.cooldowns = new Collection();
    this.commands = new Collection();
    this.aliases = new Collection();
    this.commandCooldown = new Discord.Collection();
    this.categories = fs.readdirSync("./commands");
    this.temp = new Collection();
    this.config = require("../settings/config");
  }

  start(token) {
    ["handler"].forEach((handler) => {
      require(`./${handler}`)(this);
    });
    this.login(token);
  }
}

module.exports = SUS;