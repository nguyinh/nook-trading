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
      wednesday: { AM: null, PM: null },
      thursday: { AM: null, PM: null },
      friday: { AM: null, PM: null },
      saturday: { AM: null, PM: null },
    },
  },
  turnipsOwned: {
    type: Number,
    default: null,
  },
  turnipsOwnedValue: {
    type: Number,
    default: null,
  },
  areTurnipSold: {
    type: Boolean,
    default: false,
  },
  sundayPrice: {
    type: Number,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

turnipTrendScheme.pre("validate", async (next) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisSunday = new Date(today.setDate(today.getDate() - today.getDay()));
  const result = await TurnipTrend.findOne({
    createdAt: { $gte: thisSunday },
    author: this.author,
  });
  if (result) {
    next(new Error("Another Turnip Trend is already created for this week"));
  } else {
    next();
  }
});

const TurnipTrend = mongoose.model("TurnipTrend", turnipTrendScheme);

module.exports = TurnipTrend;
