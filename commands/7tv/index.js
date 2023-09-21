const config = require('../../config.json');

const fetch = require('node-fetch');

const linkRegEx = /https:\/\/7tv\.app\/emotes\/([0-9a-z]{24})/;

const getError = (errorCode, errorMessage) => {
  switch (Number(errorCode)) {
    case 704620:
      return {
        text: 'Your emote-set has reached its maximum capacity. FeelsBadMan',
      };
    case 704610:
      return {
        text: 'The emote is not enabled. FeelsDankMan',
      };
    case 704611:
      return {
        text: 'The emote is already enabled. FeelsDankMan',
      };
    case 704612:
      return {
        text: 'The emote name already exists. FeelsDankMan',
      };
    case 70429:
      return {
        text: "We're rate limited. NotLikeThis",
      };
    case 70403:
      return {
        text: 'Please grant @LsCo as 7tv editor :)',
      };
    case 70433:
      return {
        text: "BRUH I'm banned on 7TV",
      };
    case 70441:
      return {
        text: 'Emote-set not found NotLikeThis',
      };
    default:
      return {
        text: "7TV's GQL returned an error. Try again later.",
      };
  }
};

module.exports = {
  Name: '7tv',
  Aliases: [],
  Description: 'Manage your 7TV Emotes.',
  Enabled: true,

  Access: {
    Global: 0,
    Channel: 2,
  },

  Cooldown: {
    Gloabl: 0,
    Channel: 2.5,
    User: 5,
  },

  Response: 1,
  execute: async (client, userstate, utils, msg) => {
    if (!msg[0]) {
      return {
        text: 'Usage: !7tv <add/remove/rename>',
      };
    }

    if (['add'].includes(msg[0].toLowerCase())) {
      if (!msg[1]) {
        return {
          text: 'Usage: !7tv add <emotes>',
        };
      }

      const message = msg
        .slice(1)
        .join(' ')
        .split(/\s|,\s?/g);

      const emotes = message.map(async (value) => {
        const emote = await utils.getEmote(
          linkRegEx.test(value.trim())
            ? value.trim().match(linkRegEx)[1]
            : value.trim(),
          linkRegEx.test(value.trim()) ? 'id' : 'name'
        );

        const emoteSet = await utils.getEmoteSet(userstate.channelID);

        const response = await fetch(`https://7tv.io/v3/gql`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.sevenTV.oauth}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            operationName: 'ChangeEmoteInSet',
            query: `mutation ChangeEmoteInSet(
              $id: ObjectID!
              $action: ListItemAction!
              $emote_id: ObjectID!
              $name: String
            ) {
              emoteSet(id: $id) {
                id
                emotes(id: $emote_id, action: $action, name: $name) {
                  id
                  name
                }
              }
            }`,
            variables: {
              action: 'ADD',
              emote_id: emote.id,
              id: emoteSet.id,
              name: null,
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(`7TV's GQL returned an error. Try again later.`);
        }

        if (data.errors) {
          return data.errors.map((data_) => {
            const errorCode = data_.message.split(' ')[0];
            const errorMessage = data_.message.split(' ').slice(1).join(' ');

            return getError(errorCode, errorMessage);
          });
        }

        return `Successfully added ${emote.name} in ${emoteSet.name}`;
      });

      const results = await Promise.all(emotes);

      return {
        text: results.length
          ? results.flat()
          : `Emote${results.length > 1 ? '(s)' : ''} not found!`,
      };
    }

    if (['rename'].includes(msg[0].toLowerCase())) {
      if (!msg[2]) {
        return {
          text: 'Usage: !7tv rename <emote> <name>',
        };
      }

      const emoteSet = await utils.getEmoteSet(userstate.channelID);

      const emote = await utils.getEmote(
        linkRegEx.test(msg[1]) ? msg[1].match(linkRegEx)[1] : msg[1],
        linkRegEx.test(msg[1]) ? 'id' : 'name',
        emoteSet.id
      );

      const response = await fetch(`https://7tv.io/v3/gql`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.sevenTV.oauth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operationName: 'ChangeEmoteInSet',
          query: `mutation ChangeEmoteInSet($id: ObjectID!, $action: ListItemAction!, $emote_id: ObjectID!, $name: String) {
                        emoteSet(id: $id) {
                            id
                            emotes(id: $emote_id, action: $action, name: $name) {
                                id
                                name
                            }
                        }
                    }`,
          variables: {
            action: 'UPDATE',
            emote_id: emote.id,
            id: emoteSet.id,
            name: msg[2],
          },
        }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(`7TV's GQL returned an error. Try again later.`);

      if (data.errors) {
        return data.errors.map((data_) => {
          const errorCode = data_.message.split(' ')[0];
          const errorMessage = data_.message.split(' ').slice(1).join(' ');

          return getError(errorCode, errorMessage);
        });
      }

      return {
        text: `Successfully renamed ${emote.name} to ${msg[2]} in ${emoteSet.name}`,
      };
    }

    if (['remove'].includes(msg[0].toLowerCase())) {
      if (!msg[1]) {
        return {
          text: 'Usage: !7tv remove <emotes>',
        };
      }

      const message = msg
        .slice(1)
        .join(' ')
        .split(/\s|,\s?/g);

      const emotes = message.map(async (value) => {
        const emoteSet = await utils.getEmoteSet(userstate.channelID);

        const emote = await utils.getEmote(
          linkRegEx.test(value.trim())
            ? value.trim().match(linkRegEx)[1]
            : value.trim(),
          linkRegEx.test(value.trim()) ? 'id' : 'name',
          emoteSet.id
        );

        const response = await fetch(`https://7tv.io/v3/gql`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.sevenTV.oauth}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            operationName: 'ChangeEmoteInSet',
            query: `mutation ChangeEmoteInSet(
              $id: ObjectID!
              $action: ListItemAction!
              $emote_id: ObjectID!
              $name: String
            ) {
              emoteSet(id: $id) {
                id
                emotes(id: $emote_id, action: $action, name: $name) {
                  id
                  name
                }
              }
            }`,
            variables: {
              action: 'REMOVE',
              emote_id: emote.id,
              id: emoteSet.id,
              name: null,
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(`7TV's GQL returned an error. Try again later.`);
        }

        if (data.errors) {
          return data.errors.map((data_) => {
            const errorCode = data_.message.split(' ')[0];
            const errorMessage = data_.message.split(' ').slice(1).join(' ');

            return getError(errorCode, errorMessage);
          });
        }

        return `Successfully removed ${emote.name} in ${emoteSet.name}`;
      });

      const results = await Promise.all(emotes);

      return {
        text: results.length
          ? results.flat()
          : `Emote${results.length > 1 ? '(s)' : ''} not found!`,
      };
    }
  },
};
