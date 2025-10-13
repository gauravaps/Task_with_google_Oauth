import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../axios";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // method (email / sms) & value (email or phone number)
  const method = location.state?.method || "";
  const value = location.state?.value || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let res;
      if (method === "sms") {
        res = await API.post("/auth/verify-otp", { phone: value, otp });
      } else {
        res = await API.post("/auth/verify-otp", { email: value, otp });
      }

      setMessage(res.data.message);

      if (res.data.success && res.data.resetToken) {
        localStorage.setItem("resetToken", res.data.resetToken);

        setTimeout(() => {
          navigate("/reset-password");
        }, 1000);
      }
    } catch (err) {
      console.error("Verify OTP Error:", err);
      setMessage(
        err.response?.data?.message || "Failed to verify OTP. Try again."
      );
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
      }}
    >
      <div
        style={{
          background: "rgba(0, 0, 0, 0.7)",
          padding: "40px",
          borderRadius: "8px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h2>Verify OTP</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#555" : "#E50914",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "15px", fontSize: "14px", color: "#0f0" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
