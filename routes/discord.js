const express = require("express");
require("dotenv").config();

const router = express.Router();
const { discord } = require("../controllers");
const { verifyJWT, findUser } = require("../middlewares");

const redirect = encodeURIComponent(
  process.env.ENV !== "dev"
    ? "https://nook-trading.herokuapp.com/api/discord/callback"
    : "http://localhost:2020/api/discord/callback"
);

router.route("/discord").get((req, res, next) => {
  // Redirect to Discord authentification
  return res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_APP_ID}&redirect_uri=${redirect}&response_type=code&scope=guilds.join%20identify`
  );
});

router.route("/discord/callback").get(verifyJWT, findUser, discord.linkUser);

module.exports = router;
