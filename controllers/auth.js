const { logger } = require("../middlewares");
const { users } = require("../services");
const Boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models");

exports.connect = async (req, res, next) => {
  const { _id } = req.decoded;

  logger.info("[CONTROLLERS | auth] connect");

  try {
    const fetchedUser = await users.findById(
      _id
    );

    if (!fetchedUser) {res.clearCookie('token');return next(Boom.unauthorized('User deleted'));}

    const { pseudo, islandName } = fetchedUser;

    // TODO: refresh token
    // const JWTToken = jwt.sign(
    //   {
    //     _id
    //   },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "1y" }
    // );
    // const oneYear = 65 * 24 * 60 * 60 * 1000;
    // res.cookie("token", JWTToken, {
    //   maxAge: oneYear,
    //   httpOnly: true,
    //   // secure: true,
    // });

    return res.send({ user: { _id, pseudo, islandName } });
  } catch (err) {
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  const { pseudo, password } = req.body;

  if (!pseudo || !password)
    return next(Boom.badRequest("Missing parameter in request body"));

  logger.info("[CONTROLLERS | auth] login");

  try {
    const fetchedUser = await users.findByPseudo(
      pseudo
    );
    if (!fetchedUser) return next(Boom.unauthorized('Wrong pseudo'));

    const { _id, islandName, password: hash } = fetchedUser;

    const isPasswordCorrect = await bcrypt.compare(password, hash);

    if (!isPasswordCorrect) return next(Boom.unauthorized("Wrong password"));

    const JWTToken = jwt.sign(
      {
        _id
      },
      process.env.JWT_SECRET,
      { expiresIn: "1y" }
    );
    // res.clearCookie('token');
    const oneYear = 65 * 24 * 60 * 60 * 1000;
    res.cookie("token", JWTToken, {
      maxAge: oneYear,
      httpOnly: true,
      // secure: true
    });

    return res.send({ user: { _id, pseudo, islandName } });
  } catch (err) {
    return next(err);
  }
};

exports.signin = async (req, res, next) => {
  const { password, pseudo, islandName } = req.body;

  if (!password || !pseudo || !islandName)
    return next(Boom.badRequest("Missing parameter in request body"));

  logger.info(
    `[CONTROLLERS | auth] signin | ${pseudo} in island ${islandName}`
  );

  try {
    const hash = await bcrypt.hash(password, 10);

    const { _id } = await users.add(hash, pseudo, islandName);

    const JWTToken = jwt.sign(
      {
        _id
      },
      process.env.JWT_SECRET,
      { expiresIn: "1y" }
    );
    // res.clearCookie('token');
    const oneYear = 65 * 24 * 60 * 60 * 1000;
    res.cookie("token", JWTToken, {
      maxAge: oneYear,
      httpOnly: true,
      // secure: true,
    });

    return res.status(201).send({ user: { _id, pseudo, islandName } });
  } catch (err) {
    console.log(err);
    if (err.code === 11000)
      return next(Boom.conflict("Pseudo already taken"));
    return next(err);
  }
};

exports.logout = async (req, res, next) => {
  logger.info("[CONTROLLERS | auth] logout");

  try {
    res.clearCookie('token');

    return res.send('Disconnect successful');
  } catch (err) {
    return next(err);
  }
};