import { useState } from "react";
import API from "../axios";
import { ClipLoader } from "react-spinners"; 

export default function Register() {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setPicture(e.target.files[0]);
  };

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/.test(email);

  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true); 

    if (!form.name || !form.email || !form.phone || !form.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }
    if (!validateEmail(form.email)) {
      setError("Invalid email format");
      setLoading(false);
      return;
    }
    if (!validatePhone(form.phone)) {
      setError("Phone must be 10 digits");
      setLoading(false);
      return;
    }

    try {
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
        <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Create Account</h2>

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
                type={field === "password" ? "password" : field === "email" ? "email" : "text"}
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
            disabled={loading} 
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#888" : "#E50914",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "0.3s",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {loading ? (
              <>
                <ClipLoader size={20} color="#fff" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p style={{ fontSize: "14px", color: "#ccc", marginTop: "15px" }}>
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
      </div>
    </div>
  );
}
