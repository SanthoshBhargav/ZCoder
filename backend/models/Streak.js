const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const streakSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  totalProblemsSolved: {
    type: Number,
    default: 0,
  },
  // Store dates as "YYYY-MM-DD" strings for easy dedup
  solvedDates: [
    {
      type: String,
    },
  ],
  // Track difficulty breakdown
  easySolved: { type: Number, default: 0 },
  mediumSolved: { type: Number, default: 0 },
  hardSolved: { type: Number, default: 0 },
  lastSolvedDate: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

const Streak = mongoose.model("Streak", streakSchema, "streaks");

module.exports = Streak;
