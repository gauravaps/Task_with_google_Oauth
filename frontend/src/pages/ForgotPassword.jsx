import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axios";

export default function ForgotPassword() {
  const [method, setMethod] = useState("email");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  // 🧠 Helper to build API payload based on method
  const buildPayload = () => {
    if (method === "sms") {
      return { method, phone: value };
    }
    return { method, email: value };
  };

  // 🛡 Simple validation
  const isValidInput = () => {
    if (method === "email") {
      return /\S+@\S+\.\S+/.test(value);
    }
    if (method === "sms") {
      return /^[0-9]{10}$/.test(value); // 10 digit phone number
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!isValidInput()) {
      setMessage({
        text:
          method === "email"
            ? "Please enter a valid email address."
            : "Please enter a valid 10-digit phone number.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = buildPayload();
      const { data } = await API.post("/auth/send-otp", payload);

      setMessage({ text: data.message || "OTP sent successfully.", type: "success" });

      // 🕒 Redirect to Verify OTP page after short delay
      setTimeout(() => {
        navigate("/verify-otp", { state: { method, value } });
      }, 1000);
    } catch (err) {
      console.error("Send OTP Error:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to send OTP. Please try again.";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>Update password, email or phone</h2>
        <p style={{ marginBottom: "20px" }}>
          How would you like to reset your password?
        </p>

        {/* 🔘 Email / SMS Radio */}
        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <label style={radioLabelStyle}>
            <input
              type="radio"
              name="method"
              value="email"
              checked={method === "email"}
              onChange={() => setMethod("email")}
              style={radioStyle}
            />
            Email
          </label>
          <label style={radioLabelStyle}>
            <input
              type="radio"
              name="method"
              value="sms"
              checked={method === "sms"}
              onChange={() => setMethod("sms")}
              style={radioStyle}
            />
            Text Message (SMS)
          </label>
        </div>

        {/* 📨 Input Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={
              method === "email"
                ? "Enter your registered email"
                : "Enter your registered phone"
            }
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              background: loading ? "#555" : "#E50914",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        {/* ✅ Success / ❌ Error Message */}
        {message.text && (
          <p
            style={{
              marginTop: "15px",
              fontSize: "14px",
              color: message.type === "success" ? "#0f0" : "#f33",
              fontWeight: "500",
            }}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}

/* 🎨 Styles */
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundImage:
    "url('https://images.pexels.com/photos/325044/pexels-photo-325044.jpeg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const cardStyle = {
  background: "rgba(0, 0, 0, 0.7)",
  padding: "40px",
  borderRadius: "8px",
  maxWidth: "400px",
  width: "100%",
  textAlign: "center",
  color: "#fff",
};

const headingStyle = {
  marginBottom: "20px",
};

const radioLabelStyle = {
  display: "block",
  marginBottom: "8px",
  cursor: "pointer",
};

const radioStyle = {
  marginRight: "8px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "20px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  fontSize: "16px",
  transition: "background 0.3s ease",
};
