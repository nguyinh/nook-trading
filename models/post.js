const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const userScheme = mongoose.Schema({
  _id: ObjectId,
  author: {
    type: ObjectId,
    ref: 'User'
  },
  shopPicture: {
    data: Buffer,
    contentType: String
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  }
});

module.exports = mongoose.model('User', userScheme);;
