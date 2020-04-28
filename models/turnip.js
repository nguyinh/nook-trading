const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const turnipTrendScheme = mongoose.Schema({
  _id: ObjectId,
  author: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  prices: {
    type: Object,
    default: {
      monday: { AM: null, PM: null },
      tuesday: { AM: null, PM: null },
      wenesday: { AM: null, PM: null },
      tuesday: { AM: null, PM: null },
      friday: { AM: null, PM: null },
      saturday: { AM: null, PM: null },
    },
  },
  turnipsOwned: {
    type: Number,
    default: 0,
  },
  turnipsOwnedValue: {
    type: Number,
    default: 0,
  },
  areTurnipSold: {
    type: Boolean,
    default: false,
  },
  sundayPrice: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TurnipTrend = mongoose.model("TurnipTrend", turnipTrendScheme);

module.exports = TurnipTrend;
