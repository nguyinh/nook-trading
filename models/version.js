const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const versionScheme = mongoose.Schema({
  _id: ObjectId,
  number: {
    type: String,
    required: true,
    unique: true
  },
  isCurrent: {
    type: Boolean,
  },
  types: {
    type: [String],
  },
  preMessage: {
    type: String,
  },
  changelogs: {
    type: [String],
  },
  postMessage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Version = mongoose.model("Version", versionScheme);

Version.init().then(() => console.log('Versions collection initiated'));

module.exports = Version;
