const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const bookingScheme = mongoose.Schema({
  author: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const postScheme = mongoose.Schema({
  _id: ObjectId,
  author: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  shopPicture: {
    data: Buffer,
    contentType: String
  },
  items: {
    type: [{
      type: ObjectId,
      ref: 'Item',
      required: true
    }],
  },
  bookings: {
    type: [bookingScheme]
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Post', postScheme);
