const express = require("express");
const router = express.Router();
const Streak = require("../models/Streak");
const auth = require("../middleware/auth");

// Helper to get today's date as YYYY-MM-DD
function getToday() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

// Helper to get yesterday's date as YYYY-MM-DD
function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

// Helper to calculate streak from sorted date array
function calculateStreak(solvedDates) {
  if (!solvedDates || solvedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const unique = [...new Set(solvedDates)].sort().reverse();
  const today = getToday();
  const yesterday = getYesterday();

  // Current streak: count consecutive days ending at today or yesterday
  let currentStreak = 0;
  if (unique[0] === today || unique[0] === yesterday) {
    let expected = new Date(unique[0]);
    for (const dateStr of unique) {
      const d = new Date(dateStr);
      if (d.getTime() === expected.getTime()) {
        currentStreak++;
        expected.setDate(expected.getDate() - 1);
      } else if (d < expected) {
        break;
      }
    }
  }

  // Longest streak
  let longestStreak = 1;
  let streak = 1;
  const sorted = [...unique].sort();
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) {
      streak++;
      longestStreak = Math.max(longestStreak, streak);
    } else {
      streak = 1;
    }
  }

  return { currentStreak, longestStreak };
}

// POST /api/streak/record - Record a problem solve
router.post("/record", auth, async (req, res) => {
  try {
    const { difficulty } = req.body;
    const userId = req.user.user_id;
    const today = getToday();

    let streak = await Streak.findOne({ userId });

    if (!streak) {
      streak = new Streak({ userId });
    }

    // Only count once per day
    if (!streak.solvedDates.includes(today)) {
      streak.solvedDates.push(today);
      streak.totalProblemsSolved += 1;

      if (difficulty === "Easy") streak.easySolved += 1;
      else if (difficulty === "Medium") streak.mediumSolved += 1;
      else if (difficulty === "Hard") streak.hardSolved += 1;

      // Recalculate streaks
      const { currentStreak, longestStreak } = calculateStreak(streak.solvedDates);
      streak.currentStreak = currentStreak;
      streak.longestStreak = Math.max(streak.longestStreak, longestStreak);
      streak.lastSolvedDate = today;

      await streak.save();
    }

    res.json({
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      totalProblemsSolved: streak.totalProblemsSolved,
      easySolved: streak.easySolved,
      mediumSolved: streak.mediumSolved,
      hardSolved: streak.hardSolved,
      solvedDates: streak.solvedDates,
    });
  } catch (err) {
    console.error("Streak record error:", err);
    res.status(500).json({ error: "Failed to record streak" });
  }
});

// GET /api/streak - Get current user's streak data
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.user_id;
    let streak = await Streak.findOne({ userId });

    if (!streak) {
      streak = new Streak({ userId });
      await streak.save();
    }

    // Recalculate on fetch to handle timezone edge cases
    const { currentStreak } = calculateStreak(streak.solvedDates);
    streak.currentStreak = currentStreak;
    await streak.save();

    res.json({
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      totalProblemsSolved: streak.totalProblemsSolved,
      easySolved: streak.easySolved,
      mediumSolved: streak.mediumSolved,
      hardSolved: streak.hardSolved,
      solvedDates: streak.solvedDates,
    });
  } catch (err) {
    console.error("Streak fetch error:", err);
    res.status(500).json({ error: "Failed to fetch streak" });
  }
});

// GET /api/streak/:userId - Get another user's streak (public)
router.get("/:userId", async (req, res) => {
  try {
    const streak = await Streak.findOne({ userId: req.params.userId });

    if (!streak) {
      return res.json({
        currentStreak: 0,
        longestStreak: 0,
        totalProblemsSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        solvedDates: [],
      });
    }

    res.json({
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      totalProblemsSolved: streak.totalProblemsSolved,
      easySolved: streak.easySolved,
      mediumSolved: streak.mediumSolved,
      hardSolved: streak.hardSolved,
      solvedDates: streak.solvedDates,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch streak" });
  }
});

module.exports = router;
