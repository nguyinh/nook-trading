const mongoose = require("mongoose");
const { Version } = require("../models");

exports.findLatest = () => {
  return Version.findOne({ isCurrent: true }).select("number types changelogs preMessage postMessage");
};

exports.create = (number, types, changelogs, preMessage, postMessage) => {
  return Version.create({
    _id: new mongoose.Types.ObjectId(),
    number,
    types,
    changelogs,
    preMessage,
    postMessage,
    isCurrent: true,
  });
};

exports.disableLastVersion = () => {
  return Version.updateMany(
    {
      isCurrent: true,
    },
    { isCurrent: false }
  );
};
