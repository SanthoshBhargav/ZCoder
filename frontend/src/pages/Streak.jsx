import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StreakHeatmap from "../components/StreakHeatmap";
import "../styles/Streak.css";

function Streak() {
  const navigate = useNavigate();
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backend = import.meta.env.VITE_BACKEND_URL || "https://zcoder-backend.vercel.app";

  useEffect(() => {
    const jwtoken = localStorage.getItem("jwtoken");
    if (!jwtoken) {
      navigate("/login");
      return;
    }

    const fetchStreak = async () => {
      try {
        const res = await axios.get(`${backend}/api/streak`, {
          headers: { Authorization: `Bearer ${jwtoken}` },
        });
        setStreakData(res.data);
      } catch (err) {
        setError("Failed to load streak data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();
  }, [navigate, backend]);

  if (loading) {
    return (
      <div className="streak-page">
        <div className="streak-loading">Loading streak data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="streak-page">
        <div className="streak-error">{error}</div>
      </div>
    );
  }

  const total = streakData.easySolved + streakData.mediumSolved + streakData.hardSolved;

  return (
    <div className="streak-page">
      <div className="streak-header">
        <h1>🔥 Your Coding Streak</h1>
        <p>Keep solving problems daily to build your streak!</p>
      </div>

      <div className="streak-stats-grid">
        <div className="streak-stat-card current">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{streakData.currentStreak}</div>
          <div className="stat-label">Current Streak</div>
        </div>

        <div className="streak-stat-card longest">
          <div className="stat-icon">🏆</div>
          <div className="stat-value">{streakData.longestStreak}</div>
          <div className="stat-label">Longest Streak</div>
        </div>

        <div className="streak-stat-card total">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{streakData.totalProblemsSolved}</div>
          <div className="stat-label">Total Solved</div>
        </div>
      </div>

      <div className="streak-breakdown">
        <h3>Difficulty Breakdown</h3>
        <div className="breakdown-bars">
          <div className="breakdown-item">
            <div className="breakdown-label">
              <span className="dot easy" /> Easy
              <span className="breakdown-count">{streakData.easySolved}</span>
            </div>
            <div className="breakdown-bar-bg">
              <div
                className="breakdown-bar-fill easy"
                style={{ width: total > 0 ? `${(streakData.easySolved / total) * 100}%` : "0%" }}
              />
            </div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label">
              <span className="dot medium" /> Medium
              <span className="breakdown-count">{streakData.mediumSolved}</span>
            </div>
            <div className="breakdown-bar-bg">
              <div
                className="breakdown-bar-fill medium"
                style={{ width: total > 0 ? `${(streakData.mediumSolved / total) * 100}%` : "0%" }}
              />
            </div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label">
              <span className="dot hard" /> Hard
              <span className="breakdown-count">{streakData.hardSolved}</span>
            </div>
            <div className="breakdown-bar-bg">
              <div
                className="breakdown-bar-fill hard"
                style={{ width: total > 0 ? `${(streakData.hardSolved / total) * 100}%` : "0%" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="streak-heatmap-section">
        <h3>Activity Heatmap</h3>
        <StreakHeatmap solvedDates={streakData.solvedDates} />
      </div>

      <div className="streak-tips">
        <h3>💡 Tips to Keep Your Streak</h3>
        <ul>
          <li>Solve at least one problem every day</li>
          <li>Start with Easy problems if you're short on time</li>
          <li>Use the calendar to plan your practice schedule</li>
          <li>Join a room for accountability with friends</li>
        </ul>
      </div>
    </div>
  );
}

export default Streak;
