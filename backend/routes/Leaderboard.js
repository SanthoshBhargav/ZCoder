const express = require("express");
const router = express.Router();
const Streak = require("../models/Streak");
const Solution = require("../models/Solution");
const User = require("../models/UserModel");

// GET /api/leaderboard - Get top users by problems solved
router.get("/", async (req, res) => {
  try {
    // Aggregate from streaks collection
    const leaderboard = await Streak.find({ totalProblemsSolved: { $gt: 0 } })
      .populate("userId", "Username profilePicture name")
      .sort({ totalProblemsSolved: -1 })
      .limit(50)
      .lean();

    const result = leaderboard
      .filter((entry) => entry.userId) // filter out orphaned entries
      .map((entry, index) => ({
        rank: index + 1,
        userId: entry.userId._id,
        username: entry.userId.Username,
        name: entry.userId.name,
        profilePicture: entry.userId.profilePicture,
        totalProblemsSolved: entry.totalProblemsSolved,
        currentStreak: entry.currentStreak,
        longestStreak: entry.longestStreak,
        easySolved: entry.easySolved,
        mediumSolved: entry.mediumSolved,
        hardSolved: entry.hardSolved,
      }));

    res.json(result);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// GET /api/leaderboard/streaks - Top users by current streak
router.get("/streaks", async (req, res) => {
  try {
    const leaderboard = await Streak.find({ currentStreak: { $gt: 0 } })
      .populate("userId", "Username profilePicture name")
      .sort({ currentStreak: -1 })
      .limit(50)
      .lean();

    const result = leaderboard
      .filter((entry) => entry.userId)
      .map((entry, index) => ({
        rank: index + 1,
        userId: entry.userId._id,
        username: entry.userId.Username,
        name: entry.userId.name,
        profilePicture: entry.userId.profilePicture,
        currentStreak: entry.currentStreak,
        longestStreak: entry.longestStreak,
        totalProblemsSolved: entry.totalProblemsSolved,
      }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch streak leaderboard" });
  }
});

// GET /api/leaderboard/solutions - Top users by solutions posted
router.get("/solutions", async (req, res) => {
  try {
    const result = await Solution.aggregate([
      {
        $group: {
          _id: "$author",
          solutionCount: { $sum: 1 },
          totalVotes: { $sum: "$votes" },
        },
      },
      { $sort: { solutionCount: -1, totalVotes: -1 } },
      { $limit: 50 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          username: "$user.Username",
          profilePicture: "$user.profilePicture",
          solutionCount: 1,
          totalVotes: 1,
        },
      },
    ]);

    const ranked = result.map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));

    res.json(ranked);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch solutions leaderboard" });
  }
});

module.exports = router;
