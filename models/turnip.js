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
  trendType: {
    type: String,
    enum: [
      "UNKNOWN",
      "VARIABLE",
      "SMALL_SPIKE",
      "BIG_SPIKE",
      "DECREASING",
      null,
    ],
    default: null,
  },
  previousTrendType: {
    type: String,
    enum: [
      "UNKNOWN",
      "VARIABLE",
      "SMALL_SPIKE",
      "BIG_SPIKE",
      "DECREASING",
      null,
    ],
    default: null,
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

// Middleware when new TurnipTrend is created
turnipTrendScheme.pre("validate", async function (next) {
  // Check if existing trend for an author
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastSunday = new Date(today.setDate(today.getDate() - today.getDay()));

  const result = await TurnipTrend.findOne({
    createdAt: { $gte: lastSunday },
    author: this.author,
  });
  if (result) {
    next(new Error("Another Turnip Trend is already created for this week"));
  }

  // Pre-fill previousTrendType field for new doc
  const lastlastSunday = new Date(today.setDate(today.getDate() - 7));

  const lastWeekTrend = await TurnipTrend.findOne({
    createdAt: { $gte: lastlastSunday, $lte: lastSunday },
    author: this.author,
  });

  if (lastWeekTrend) this.previousTrendType = lastWeekTrend.trendType || null;

  next();
});

const TurnipTrend = mongoose.model("TurnipTrend", turnipTrendScheme);

module.exports = TurnipTrend;
