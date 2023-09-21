# Adding 7TV Emotes to Twitch Channel

This is a [Twitch](https://www.twitch.tv/) bot designed to seamlessly integrate [7TV](https://7tv.app/) emotes into your Twitch channel. It's built using [Node.Js](https://nodejs.org/en), and below, you'll find instructions on how to set up and run this bot, even if you're a beginner with programming.
# Getting Started

To get started, follow these simple steps:

### Install Node.js

If you haven't already, you'll need to install Node.js on your system. You can download it from [nodejs.org](https://nodejs.org/en).

### Configure Your Bot

First, open the `exempel config.json` file and rename it to `config.json`, then modify it. Here's an example of what the configuration should look like:

```json
{
  "twitch": {
    "username": "lsco", // Your Bot's Username
    "id": "617309984", // Your Bot's ID
    "oauth": "abc123", // Your Bot's OAuth Token
    "bot": {
      "prefix": "!", // Your Custom Prefix (You can use special characters too)
      "owners": ["617309984"], // Owners' IDs
      "admins": ["617309984"], // Admins' IDs
      "channels": ["lsco", "lscotesting"] // Channels where the bot should operate
    }
  },
  "sevenTV": {
    "oauth": "hu123" // Your 7TV Token (You can find this in the Web Dev Tools on https://7tv.app using the command: localStorage["7tv-token"])
  }
}
```


**Info**
- You can generate Token on: [Twitch Token Generator](https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=gp762nuuoqcoxypju8c569th9wz7q5&redirect_uri=https://twitchtokengenerator.com&scope=chat:read+chat:edit&state=frontend|SmZGTW9KbXJCM3NtSWlJcDZsa1gxQT09&force_verify=true)

## Install Required Packages

### Run the following command to install the necessary packages and modules:

`npm install`

### Run the Bot

`node .`

## Available Commands

### The bot supports the following commands, which you can trigger with the specified prefix (e.g., !ping):

```
- ping: A simple ping command.
- 7tv add <emotes...>: Add one or more 7TV emotes.
- 7tv remove <emotes...>: Remove one or more 7TV emotes.
- 7tv rename <old name> <new name>: Rename a 7TV emote from its old name to a new one.
```