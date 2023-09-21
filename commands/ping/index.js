const os = require('os');

module.exports = {
  Name: 'ping',
  Aliases: [],
  Description:
    "Ping command, to check if the bot is alive and to check basic things e.g Uptime.",
  Enabled: true,

  Access: {
    Global: 0,
    Channel: 1,
  },

  Cooldown: {
    Gloabl: 0,
    Channel: 2.5,
    User: 5,
  },

  Response: 1,
  execute: async (client, userstate, utils, msg) => {
    return {
      text: `Pong! Uptime: ${utils.getUptime()}! Channels: ${
        client.joinedChannels.size
      }`,
    };
  },
};
