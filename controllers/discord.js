const { logger } = require("../middlewares");
const {
  discord: { client },
} = require("../services");
const Boom = require("@hapi/boom");
require("dotenv").config();

const btoa = require("btoa");
const fetch = require("node-fetch");

const redirect = encodeURIComponent(
  process.env.ENV !== "dev"
    ? "https://nook-trading.herokuapp.com/api/discord/callback"
    : "http://localhost:2020/api/discord/callback"
);

exports.linkUser = async (req, res, next) => {
  const { code } = req.query;
  const { user } = req;

  logger.info(`[CONTROLLERS] discord | linkUser ${user._id}`);

  if (!user) return Boom.notFound("No user found");

  try {
    const creds = btoa(
      `${process.env.CLIENT_APP_ID}:${process.env.CLIENT_APP_SECRET}`
    );

    // Ask for user credentials
    const credResponse = await fetch(
      `https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${creds}`,
        },
      }
    );
    const userCred = await credResponse.json();
    const { access_token, token_type, refresh_token } = userCred;
    console.log(access_token, token_type, refresh_token);

    // Ask for user identification
    const infoResponse = await fetch(`https://discordapp.com/api/users/@me`, {
      method: "GET",
      headers: {
        Authorization: `${userCred.token_type} ${userCred.access_token}`,
      },
    });
    const userInfo = await infoResponse.json();
    const { id, username, discriminator } = userInfo;
    console.log(id, username, discriminator);

    const nookTradingServer = client.guilds.cache.find(
      (guild) => guild.id == process.env.GUILD_ID
    );

    const currentUser = await client.users.fetch(userInfo.id);

    // Add connected user to guild
    await nookTradingServer.addMember(currentUser, {
      accessToken: userCred.access_token,
    });

    // Send welcome message
    await currentUser.send("ding dong");

    // Redirect to guild url
    return res.redirect("https://discord.com/channels/709446228513128450/");
  } catch (err) {
    return next(err);
  }
};
