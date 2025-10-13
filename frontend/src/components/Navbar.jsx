import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../axios";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await API.get("/auth/logout");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Styles
  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 40px",
    background: "#ffffff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  };

  const logoStyle = {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#E50914",
    textDecoration: "none",
    letterSpacing: "1px",
  };

  const linkContainer = {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  };

  const linkStyle = {
    color: "#333",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: 500,
    transition: "color 0.3s ease",
  };

  const buttonStyle = {
    padding: "8px 16px",
    background: "#E50914",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "15px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  };

  const profileContainer = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const profileImageStyle = {
    width: "38px",
    height: "38px",
    borderRadius: "50%", // 👈 round image
    objectFit: "cover",
    border: "2px solid #E50914",
    cursor: "pointer",
  };

  const hoverLink = (e) => (e.target.style.color = "#E50914");
  const leaveLink = (e) => (e.target.style.color = "#333");
  const hoverButton = (e) => (e.target.style.background = "#B0060E");
  const leaveButton = (e) => (e.target.style.background = "#E50914");

  return (
    <nav style={navStyle}>
      <Link to="/" style={logoStyle}>
        Gaurav<span style={{ color: "#000" }}>Tech</span>
      </Link>

      <div style={linkContainer}>
        {!user ? (
          <>
            <Link
              to="/login"
              style={linkStyle}
              onMouseOver={hoverLink}
              onMouseOut={leaveLink}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={linkStyle}
              onMouseOver={hoverLink}
              onMouseOut={leaveLink}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <div style={profileContainer}>
              <Link
                to="/profile"
                style={linkStyle}
                onMouseOver={hoverLink}
                onMouseOut={leaveLink}
              >
                Profile
              </Link>
              <Link to="/profile">
                <img
                  src={
                    user.picture ||
                    "https://res.cloudinary.com/gauravkacloud/image/upload/v1731986753/photo_yrra2i.png" 
                  }
                  alt="Profile"
                  style={profileImageStyle}
                />
              </Link>
            </div>

            {user.isAdmin && (
              <Link
                to="/admin"
                style={linkStyle}
                onMouseOver={hoverLink}
                onMouseOut={leaveLink}
              >
                Admin
              </Link>
            )}

            <button
              style={buttonStyle}
              onClick={handleLogout}
              onMouseOver={hoverButton}
              onMouseOut={leaveButton}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
