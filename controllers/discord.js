const btoa = require("btoa");
const fetch = require("node-fetch");
const Boom = require("@hapi/boom");
require("dotenv").config();

const { logger } = require("../middlewares");
const {
  discord: { client },
  users,
} = require("../services");

const baseURL =
  process.env.ENV !== "dev"
    ? "https://nook-trading.herokuapp.com"
    : "http://192.168.1.11:2020";
const redirect = encodeURIComponent(`${baseURL}/api/discord/callback`);

exports.linkUser = async (req, res, next) => {
  const { code } = req.query;
  const { user } = req;

  logger.info(`[CONTROLLERS] discord | linkUser ${user._id}`);

  if (!user) return Boom.notFound("No user found");

  try {
    // Ask for user credentials
    const options = {
      method: 'POST'
    };
    let params = new URLSearchParams();
    params.append('client_id', process.env.CLIENT_APP_ID);
    params.append('client_secret', process.env.CLIENT_APP_SECRET);
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    params.append('scope', 'identify guilds.join');
    params.append('redirect_uri', `${baseURL}/api/discord/callback`);
    options.body = params;
    
    const credResponse = await fetch(
      `https://discordapp.com/api/oauth2/token`, options
    );
    
    const userCred = await credResponse.json();
    const { access_token, token_type, refresh_token } = userCred;

    // Ask for user identification
    const infoResponse = await fetch(`https://discordapp.com/api/users/@me`, {
      method: "GET",
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    });
    const userInfo = await infoResponse.json();

    const { id, username, discriminator } = userInfo;

    const nookTradingServer = client.guilds.cache.find(
      (guild) => guild.id == process.env.GUILD_ID
    );

    const currentUser = await client.users.fetch(id);

    // Add connected user to guild
    await nookTradingServer.addMember(currentUser, {
      accessToken: access_token,
    });

    // Send welcome message
    await currentUser.send("Hello 👋\nRavi de faire ta connaissance ! Je suis le bot qui te tiendra au courant de ce qu'il se passe sur Nook trading 😄\nN'hésite pas à faire un tour sur le serveur Discord de Nook Trading !");

    // Save Discord data in user
    const updatedUser = await users.setDiscord(user._id, {
      accessToken: access_token,
      refreshToken: refresh_token,
      id,
      username,
      discriminator,
    });

    // Redirect to guild url
    // return res.redirect(`https://discord.com/channels/${process.env.GUILD_ID}`);
    return res.redirect(`${baseURL}/profile`);
  } catch (err) {
    return next(err);
  }
};
