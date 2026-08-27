import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Leaderboard.css";

const TABS = [
  { key: "problems", label: "🏆 Problems Solved", endpoint: "" },
  { key: "streaks", label: "🔥 Active Streaks", endpoint: "/streaks" },
  { key: "solutions", label: "📝 Solutions Posted", endpoint: "/solutions" },
];

function Leaderboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("problems");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const backend = import.meta.env.VITE_BACKEND_URL || "https://zcoder-backend.vercel.app";

  useEffect(() => {
    const jwtoken = localStorage.getItem("jwtoken");
    if (!jwtoken) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const tab = TABS.find((t) => t.key === activeTab);
        const res = await axios.get(`${backend}/api/leaderboard${tab.endpoint}`);
        setData(res.data);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, backend]);

  const getMedalEmoji = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const renderProblemsTab = () => (
    <table className="leaderboard-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>User</th>
          <th>Solved</th>
          <th>Easy</th>
          <th>Medium</th>
          <th>Hard</th>
          <th>Streak</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry) => (
          <tr key={entry.userId} className={entry.rank <= 3 ? `rank-${entry.rank}` : ""}>
            <td className="rank-cell">{getMedalEmoji(entry.rank)}</td>
            <td className="user-cell">
              <img
                src={entry.profilePicture || "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small_2x/user-icon-on-transparent-background-free-png.png"}
                alt=""
                className="leaderboard-avatar"
              />
              <span
                className="leaderboard-username"
                onClick={() => navigate(`/user/${entry.userId}`)}
              >
                {entry.username}
              </span>
            </td>
            <td className="stat-cell">{entry.totalProblemsSolved}</td>
            <td className="stat-cell easy">{entry.easySolved}</td>
            <td className="stat-cell medium">{entry.mediumSolved}</td>
            <td className="stat-cell hard">{entry.hardSolved}</td>
            <td className="stat-cell streak">🔥 {entry.currentStreak}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderStreaksTab = () => (
    <table className="leaderboard-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>User</th>
          <th>Current Streak</th>
          <th>Longest Streak</th>
          <th>Total Solved</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry) => (
          <tr key={entry.userId} className={entry.rank <= 3 ? `rank-${entry.rank}` : ""}>
            <td className="rank-cell">{getMedalEmoji(entry.rank)}</td>
            <td className="user-cell">
              <img
                src={entry.profilePicture || "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small_2x/user-icon-on-transparent-background-free-png.png"}
                alt=""
                className="leaderboard-avatar"
              />
              <span
                className="leaderboard-username"
                onClick={() => navigate(`/user/${entry.userId}`)}
              >
                {entry.username}
              </span>
            </td>
            <td className="stat-cell streak">🔥 {entry.currentStreak}</td>
            <td className="stat-cell">🏆 {entry.longestStreak}</td>
            <td className="stat-cell">{entry.totalProblemsSolved}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderSolutionsTab = () => (
    <table className="leaderboard-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>User</th>
          <th>Solutions</th>
          <th>Total Votes</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry) => (
          <tr key={entry.userId} className={entry.rank <= 3 ? `rank-${entry.rank}` : ""}>
            <td className="rank-cell">{getMedalEmoji(entry.rank)}</td>
            <td className="user-cell">
              <img
                src={entry.profilePicture || "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small_2x/user-icon-on-transparent-background-free-png.png"}
                alt=""
                className="leaderboard-avatar"
              />
              <span className="leaderboard-username">{entry.username}</span>
            </td>
            <td className="stat-cell">{entry.solutionCount}</td>
            <td className="stat-cell">👍 {entry.totalVotes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h1>🏆 Leaderboard</h1>
        <p>Top coders in the ZCoder community</p>
      </div>

      <div className="leaderboard-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tab-button ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="leaderboard-content">
        {loading ? (
          <div className="leaderboard-loading">Loading rankings...</div>
        ) : data.length === 0 ? (
          <div className="leaderboard-empty">
            <p>No rankings yet. Be the first to solve a problem!</p>
            <button className="start-btn" onClick={() => navigate("/dashboard")}>
              Start Solving →
            </button>
          </div>
        ) : (
          <>
            {activeTab === "problems" && renderProblemsTab()}
            {activeTab === "streaks" && renderStreaksTab()}
            {activeTab === "solutions" && renderSolutionsTab()}
          </>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
