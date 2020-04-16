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

const itemScheme = mongoose.Schema({
  _id: ObjectId,
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number
  },
  bookings: {
    type: [bookingScheme]
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Item', itemScheme);
