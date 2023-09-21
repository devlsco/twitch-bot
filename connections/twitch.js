const {
  ChatClient,
  AlternateMessageModifier,
  SlowModeRateLimiter,
} = require('@kararty/dank-twitch-irc');

const { twitch } = require('../config.json');

const client = new ChatClient({
  username: twitch.username,
  password: twitch.oauth,
  rateLimits: 'default',
  installDefaultMixins: true,
  maxChannelCountPerConnection: 5,
  ignoreUnhandledPromiseRejections: true,
  connectionRateLimits: {
    parallelConnections: 20,
    releaseTime: 50,
  },
});

client.joinAll(twitch.bot.channels);

client.use(new AlternateMessageModifier(client));
client.use(new SlowModeRateLimiter(client, 10));

client.connect();


module.exports = { client };
