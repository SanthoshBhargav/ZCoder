import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LuGithub } from "react-icons/lu";
import "../styles/Home.css";
import logo from "../assets/logo-noBg.png"

function Home() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const jwtoken = localStorage.getItem("jwtoken");
    if (!jwtoken) {
      navigate("/login");
    }
  }, [navigate]);

  const searched = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 2) {
      const searchTimer = setTimeout(async () => {
        try {
          const response = await fetch(`http://localhost:3000/users/${query}`);
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error("Search error:", error);
        }
      }, 800);
      
      return () => clearTimeout(searchTimer);
    } else {
      setUsers([]);
    }
  };

  const handleFeatureClick = (route) => {
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtoken");
    navigate("/login");
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <main className="main">
        <section className="hero">
          <div className="hero-content">
            <h1>
              <span className="hero-accent">Elevate</span> Your Coding Journey
            </h1>
            <p className="hero-subtitle">
              Practice, collaborate, compete, and learn—all in one powerful platform designed for developers.
            </p>
            <div className="hero-cta">
              <button 
                className="cta-btn primary"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </button>
              <button 
                className="cta-btn secondary"
                onClick={() => navigate("/rooms")}
              >
                Join a Room
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="code-snippet">
              <pre>
                {`// Welcome to Zcoder\nfunction greet() {\n  console.log("Happy coding!");\n}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="features-section">
          <h2 className="section-title">Features</h2>
          <div className="features-grid">
            <div 
              className="feature-card"
              onClick={() => handleFeatureClick("/profile")}
            >
              <div className="feature-icon">👤</div>
              <h3>Personal Profile</h3>
              <p>Track your progress and showcase your coding achievements.</p>
            </div>

            <div 
              className="feature-card"
              onClick={() => handleFeatureClick("/rooms")}
            >
              <div className="feature-icon">💬</div>
              <h3>Collaborative Rooms</h3>
              <p>Real-time coding and chat with other developers.</p>
            </div>

            <div 
              className="feature-card"
              onClick={() => handleFeatureClick("/calendar")}
            >
              <div className="feature-icon">📅</div>
              <h3>Contest Calendar</h3>
              <p>Never miss important coding competitions and hackathons.</p>
            </div>

            <div className="feature-card search-feature">
              <div className="feature-icon">🔍</div>
              <h3>Find Coders</h3>
              <input 
                type="search" 
                placeholder="Search users..."
                value={searchQuery}
                onChange={searched}
                className="user-search"
              />
              {users.length > 0 ? (
                <ul className="search-results">
                  {users.map((user) => (
                    <li 
                      key={user.id} 
                      onClick={() => navigate(`/user/${user.id}`)}
                    >
                      {user.username}
                    </li>
                  ))}
                </ul>
              ) : searchQuery.length > 2 ? (
                <p className="no-results">No users found</p>
              ) : null}
            </div>

            <div 
              className="feature-card"
              onClick={() => handleFeatureClick("/askAI")}
            >
              <div className="feature-icon">🤖</div>
              <h3>AI Assistant</h3>
              <p>Get instant help with your coding questions.</p>
            </div>

            <div 
              className="feature-card"
              onClick={() => handleFeatureClick("/dashboard")}
            >
              <div className="feature-icon">📊</div>
              <h3>Progress Dashboard</h3>
              <p>Visualize your coding journey and growth.</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stat-item">
            <h3>600+</h3>
            <p>Practise Problems</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Active Rooms</p>
          </div>
          <div className="stat-item">
            <h3>Working</h3>
            <p>Contests Calender</p>
          </div>
          <div className="stat-item">
            <h3>Instant</h3>
            <p>AI Responses</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-accent"><img src={logo} alt="logo" /></span>
          </div>
          <div className="footer-links">
            <button className="footer-link">About</button>
            <button className="footer-link">Features</button>
            <button className="footer-link">Contact</button>
            <button className="footer-link">Privacy</button>
          </div>
          <div className="footer-social">
            <button className="social-icon" onClick={() => {window.location.href = "https://github.com/vijay-kumar-79/ZCoder"}}><LuGithub /></button>
          </div>
        </div>
        <div className="footer-copyright">
          <p>&copy; 2025 Zcoder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { LuGithub, LuSparkles } from "react-icons/lu";
// import "../styles/h.css";
// import logo from "../assets/logo-noBg.png";

// function Home() {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const featuresRef = useRef(null);

//   useEffect(() => {
//     const jwtoken = localStorage.getItem("jwtoken");
//     if (!jwtoken) {
//       navigate("/login");
//     }
//   }, [navigate]);

//   useEffect(() => {
//     // Observer for feature cards animation
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add("animate-float");
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     if (featuresRef.current) {
//       const cards = featuresRef.current.querySelectorAll(".feature-card");
//       cards.forEach((card, index) => {
//         observer.observe(card);
//         card.style.setProperty("--delay", `${index * 0.1}s`);
//       });
//     }

//     return () => {
//       if (featuresRef.current) {
//         const cards = featuresRef.current.querySelectorAll(".feature-card");
//         cards.forEach(card => observer.unobserve(card));
//       }
//     };
//   }, []);

//   const searched = (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);
    
//     if (query.length > 2) {
//       const searchTimer = setTimeout(async () => {
//         try {
//           const response = await fetch(`http://localhost:3000/users/${query}`);
//           const data = await response.json();
//           setUsers(data);
//         } catch (error) {
//           console.error("Search error:", error);
//         }
//       }, 800);
      
//       return () => clearTimeout(searchTimer);
//     } else {
//       setUsers([]);
//     }
//   };

//   const handleFeatureClick = (route) => {
//     navigate(route);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("jwtoken");
//     navigate("/login");
//   };

//   return (
//     <div className="home-page">
//       {/* Floating Particles Background */}
//       <div className="particles">
//         {[...Array(15)].map((_, i) => (
//           <div key={i} className="particle" style={{
//             '--size': `${Math.random() * 10 + 5}px`,
//             '--x': `${Math.random() * 100}%`,
//             '--y': `${Math.random() * 100}%`,
//             '--delay': `${Math.random() * 5}s`,
//             '--duration': `${Math.random() * 10 + 10}s`
//           }}></div>
//         ))}
//       </div>
      
//       {/* Hero Section */}
//       <main className="main">
//         <section className="hero">
//           <div className="hero-content">
//             <div className="tagline">
//               <LuSparkles className="sparkle-icon" />
//               <span>Elevate Your Coding Journey</span>
//             </div>
//             <h1>
//               <span className="hero-accent">Code</span>, Collaborate & 
//               <span className="hero-accent"> Create</span> with Zcoder
//             </h1>
//             <p className="hero-subtitle">
//               Practice, collaborate, compete, and learn—all in one powerful platform designed for developers.
//             </p>
//             <div className="hero-cta">
//               <button 
//                 className="cta-btn primary"
//                 onClick={() => navigate("/dashboard")}
//               >
//                 <span className="btn-text">Go to Dashboard</span>
//                 <span className="btn-icon">→</span>
//               </button>
//               <button 
//                 className="cta-btn secondary"
//                 onClick={() => navigate("/rooms")}
//               >
//                 <span className="btn-text">Join a Room</span>
//                 <span className="btn-icon">💬</span>
//               </button>
//             </div>
//           </div>
//           <div className="hero-image">
//             <div className="floating-card code-snippet">
//               <div className="card-glow"></div>
//               <pre>
//                 {`// Welcome to Zcoder\nfunction innovate() {\n  return "Create amazing things!";\n}\n\n// Join our community\nconst zcoder = {\n  features: ["collaboration", "AI", "contests"],\n  launchDate: new Date()\n};`}
//               </pre>
//             </div>
//           </div>
//         </section>

//         {/* Features Grid */}
//         <section className="features-section" ref={featuresRef}>
//           <div className="section-header">
//             <h2 className="section-title">Powerful Features</h2>
//             <p className="section-subtitle">Everything you need to level up your coding skills</p>
//           </div>
//           <div className="features-grid">
//             <div 
//               className="feature-card"
//               onClick={() => handleFeatureClick("/profile")}
//             >
//               <div className="card-inner">
//                 <div className="feature-icon">👤</div>
//                 <h3>Personal Profile</h3>
//                 <p>Track your progress and showcase your coding achievements.</p>
//                 <div className="feature-arrow">→</div>
//               </div>
//             </div>

//             <div 
//               className="feature-card"
//               onClick={() => handleFeatureClick("/rooms")}
//             >
//               <div className="card-inner">
//                 <div className="feature-icon">💬</div>
//                 <h3>Collaborative Rooms</h3>
//                 <p>Real-time coding and chat with other developers.</p>
//                 <div className="feature-arrow">→</div>
//               </div>
//             </div>

//             <div 
//               className="feature-card"
//               onClick={() => handleFeatureClick("/calendar")}
//             >
//               <div className="card-inner">
//                 <div className="feature-icon">📅</div>
//                 <h3>Contest Calendar</h3>
//                 <p>Never miss important coding competitions and hackathons.</p>
//                 <div className="feature-arrow">→</div>
//               </div>
//             </div>

//             <div className="feature-card search-feature">
//               <div className="card-inner">
//                 <div className="feature-icon">🔍</div>
//                 <h3>Find Coders</h3>
//                 <div className="search-container">
//                   <input 
//                     type="search" 
//                     placeholder="Search users..."
//                     value={searchQuery}
//                     onChange={searched}
//                     className="user-search"
//                   />
//                   <div className="search-icon">🔍</div>
//                 </div>
//                 {users.length > 0 ? (
//                   <ul className="search-results">
//                     {users.map((user) => (
//                       <li 
//                         key={user.id} 
//                         onClick={() => navigate(`/user/${user.id}`)}
//                       >
//                         <div className="user-avatar">👤</div>
//                         <div className="user-info">
//                           <span className="username">{user.username}</span>
//                           <span className="user-title">Developer</span>
//                         </div>
//                         <div className="user-arrow">→</div>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : searchQuery.length > 2 ? (
//                   <p className="no-results">No users found</p>
//                 ) : null}
//               </div>
//             </div>

//             <div 
//               className="feature-card"
//               onClick={() => handleFeatureClick("/askAI")}
//             >
//               <div className="card-inner">
//                 <div className="feature-icon">🤖</div>
//                 <h3>AI Assistant</h3>
//                 <p>Get instant help with your coding questions.</p>
//                 <div className="feature-arrow">→</div>
//               </div>
//             </div>

//             <div 
//               className="feature-card"
//               onClick={() => handleFeatureClick("/dashboard")}
//             >
//               <div className="card-inner">
//                 <div className="feature-icon">📊</div>
//                 <h3>Progress Dashboard</h3>
//                 <p>Visualize your coding journey and growth.</p>
//                 <div className="feature-arrow">→</div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Stats Section */}
//         <section className="stats-section">
//           <div className="stats-container">
//             <div className="stat-item">
//               <div className="stat-circle">
//                 <h3>600+</h3>
//               </div>
//               <p>Practise Problems</p>
//             </div>
//             <div className="stat-item">
//               <div className="stat-circle">
//                 <h3>24/7</h3>
//               </div>
//               <p>Active Rooms</p>
//             </div>
//             <div className="stat-item">
//               <div className="stat-circle">
//                 <h3>Working</h3>
//               </div>
//               <p>Contests Calender</p>
//             </div>
//             <div className="stat-item">
//               <div className="stat-circle">
//                 <h3>Instant</h3>
//               </div>
//               <p>AI Responses</p>
//             </div>
//           </div>
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className="footer">
//         <div className="footer-content">
//           <div className="footer-brand">
//             <div className="footer-logo">
//               <img src={logo} alt="logo" />
//             </div>
//             <p className="footer-tagline">Code without limits</p>
//           </div>
//           <div className="footer-links">
//             <div className="link-group">
//               <h4>Product</h4>
//               <button className="footer-link">Features</button>
//               <button className="footer-link">Pricing</button>
//               <button className="footer-link">Updates</button>
//             </div>
//             <div className="link-group">
//               <h4>Company</h4>
//               <button className="footer-link">About</button>
//               <button className="footer-link">Careers</button>
//               <button className="footer-link">Contact</button>
//             </div>
//             <div className="link-group">
//               <h4>Resources</h4>
//               <button className="footer-link">Documentation</button>
//               <button className="footer-link">Community</button>
//               <button className="footer-link">Support</button>
//             </div>
//           </div>
//           <div className="footer-actions">
//             <div className="footer-social">
//               <button 
//                 className="social-icon" 
//                 onClick={() => {window.location.href = "https://github.com/vijay-kumar-79/ZCoder"}}
//               >
//                 <LuGithub />
//               </button>
//             </div>
//             <button className="newsletter-btn">
//               Subscribe to Newsletter
//             </button>
//           </div>
//         </div>
//         <div className="footer-copyright">
//           <p>&copy; 2025 Zcoder. All rights reserved.</p>
//           <div className="legal-links">
//             <button className="footer-link">Privacy Policy</button>
//             <button className="footer-link">Terms of Service</button>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default Home;