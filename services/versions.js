const mongoose = require("mongoose");
const { Version } = require("../models");

exports.findLatest = () => {
  return Version.findOne({ isCurrent: true }).select("number types changelogs");
};

exports.create = (number, types, changelogs) => {
  return Version.create({
    _id: new mongoose.Types.ObjectId(),
    number,
    types,
    changelogs,
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
