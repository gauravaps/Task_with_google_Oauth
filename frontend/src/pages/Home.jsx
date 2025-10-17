import { useState } from "react";
import API from "../axios";
import { ClipLoader } from "react-spinners"; 

export default function Home() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [picture, setPicture] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleGoogleLogin = () => {
    // window.location.href = "http://localhost:5000/auth/google";
    window.location.href = "https://task-manager-backend-k6jq.onrender.com/auth/google";

  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFile = (e) => setPicture(e.target.files[0]);

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.phone || !form.password) {
      setError("All fields are required");
      return;
    }
    if (!validateEmail(form.email)) {
      setError("Invalid email format");
      return;
    }
    if (!validatePhone(form.phone)) {
      setError("Phone must be 10 digits");
      return;
    }

    try {
      setLoading(true); 
      const data = new FormData();
      data.append("name", form.name);
      data.append("email", form.email);
      data.append("phone", form.phone);
      data.append("password", form.password);
      if (picture) data.append("picture", picture);

      const res = await API.post("/auth/register", data);
      setSuccess(res.data.message);
      setForm({ name: "", email: "", phone: "", password: "" });
      setPicture(null);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false); 
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
          background: "rgba(0, 0, 0, 0.7)",
          padding: "40px",
          borderRadius: "12px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
          color: "#fff",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>
          Create Your Account
        </h2>

        {error && (
          <p
            style={{
              background: "#ff4d4d",
              padding: "10px",
              borderRadius: "5px",
              fontSize: "14px",
              marginBottom: "15px",
            }}
          >
            {error}
          </p>
        )}

        {success && (
          <p
            style={{
              background: "#4BB543",
              padding: "10px",
              borderRadius: "5px",
              fontSize: "14px",
              marginBottom: "15px",
            }}
          >
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {["name", "email", "phone", "password"].map((field) => (
            <div key={field} style={{ marginBottom: "15px" }}>
              <input
                type={
                  field === "password"
                    ? "password"
                    : field === "email"
                    ? "email"
                    : "text"
                }
                name={field}
                placeholder={
                  field === "name"
                    ? "Full Name"
                    : field === "email"
                    ? "Email Address"
                    : field === "phone"
                    ? "Phone Number (10 digits)"
                    : "Password"
                }
                value={form[field]}
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
          ))}

          <div style={{ marginBottom: "20px" }}>
            <input
              type="file"
              onChange={handleFile}
              style={{
                color: "#fff",
                cursor: "pointer",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              background: "#E50914",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "0.3s",
              marginBottom: "12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}
            disabled={loading} 
            onMouseOver={(e) => (e.target.style.background = "#B0060E")}
            onMouseOut={(e) => (e.target.style.background = "#E50914")}
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Register"}
          </button>
        </form>

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
            gap: "10px",
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

        <p style={{ fontSize: "14px", color: "#ccc" }}>
          Already have an account?{" "}
          <a
            href="/login"
            style={{
              color: "#E50914",
              textDecoration: "none",
              fontWeight: "bold",
            }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            Login
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
