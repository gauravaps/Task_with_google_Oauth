import { useState } from "react";
import API from "../axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");


const handleGoogleLogin = () => {
    // window.location.href = "http://localhost:5000/auth/google";
      window.location.href = "https://task-manager-backend-k6jq.onrender.com/auth/google";

  };


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await API.post("/auth/login", form);
      window.location.href = "/profile"; // redirect to profile page
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.pexels.com/photos/325044/pexels-photo-325044.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "rgba(0, 0, 0, 0.75)",
          padding: "40px",
          borderRadius: "12px",
          maxWidth: "380px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
          color: "#fff",
        }}
      >
        <h2
          style={{
            marginBottom: "25px",
            fontSize: "26px",
            fontWeight: "600",
            letterSpacing: "1px",
          }}
        >
          Welcome Back 👋
        </h2>

        {error && (
          <p
            style={{
              background: "#ff4d4d",
              padding: "10px",
              borderRadius: "6px",
              fontSize: "14px",
              marginBottom: "15px",
            }}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "18px" }}>
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "14px",
                outline: "none",
                transition: "0.3s",
              }}
              onFocus={(e) => (e.target.style.border = "1px solid #E50914")}
              onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <input
              type="password"
              name="password"
              placeholder="Enter your Password"
              value={form.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "14px",
                outline: "none",
                transition: "0.3s",
              }}
              onFocus={(e) => (e.target.style.border = "1px solid #E50914")}
              onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "15px",
              background: "#E50914",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#B0060E")}
            onMouseOut={(e) => (e.target.style.background = "#E50914")}
          >
            Login
          </button>

<br /><br />
          <button
  onClick={handleGoogleLogin}
  style={{
    width: "100%",
    padding: "12px",
    background: "#4285F4",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "10px",
    transition: "0.3s",
    display: "flex",           
    alignItems: "center",      
    justifyContent: "center",  
    gap: "10px"                
  }}
  onMouseOver={(e) => (e.target.style.background = "#3367D6")}
  onMouseOut={(e) => (e.target.style.background = "#4285F4")}
>
  <img
    src="https://res.cloudinary.com/gauravkacloud/image/upload/v1760329580/download_bl1r0g.png"
    alt="Google Logo"
    style={{ width: "24px", height: "24px" }} 
  />
  Continue with Google
</button>

        </form>

        <p
          style={{
            marginTop: "18px",
            fontSize: "14px",
            color: "#ccc",
          }}
        >
          Don't have an account?{" "}
          <a
            href="/register"
            style={{
              color: "#E50914",
              textDecoration: "none",
              fontWeight: "bold",
            }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            Register
          </a>
        </p>

        
        <p style={{ marginTop: "12px" }}>
          <a
            href="/forgot-password"
            style={{
              color: "#bbb",
              fontSize: "13px",
              textDecoration: "none",
            }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            Forgot Password?
          </a>
        </p>
      </div>
    </div>
  );
}
