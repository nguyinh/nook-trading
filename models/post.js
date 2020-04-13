const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const postScheme = mongoose.Schema({
  _id: ObjectId,
  author: {
    type: ObjectId,
    ref: 'User'
  },
  shopPicture: {
    data: Buffer,
    contentType: String
  },
  articles: {
    type: Array
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  }
});

module.exports = mongoose.model('Post', postScheme);
