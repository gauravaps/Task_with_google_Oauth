import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axios";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("❌ Password and confirm password do not match");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("resetToken");
    if (!token) {
      setMessage("❌ Reset token missing. Please restart the process.");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post(
        "/auth/reset-password",
        { newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message);

      if (res.data.success) {
        localStorage.removeItem("resetToken");
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (err) {
      console.error("Reset Password Error:", err);
      setMessage(
        err.response?.data?.message || "Failed to reset password. Try again."
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
        padding: "15px",
      }}
    >
      <div
        style={{
          background: "rgba(0, 0, 0, 0.7)",
          padding: "30px",
          borderRadius: "10px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
          color: "#fff",
          boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
          boxSizing: "border-box",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontSize: "22px" }}>Reset Password</h2>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* New Password */}
          <div
            style={{
              position: "relative",
              marginBottom: "15px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 45px 12px 12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <span
              onClick={() => setShowNewPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#0e0909e5",
                fontSize: "14px",
              }}
            >
              {showNewPassword ? "Hide" : "Show"}
            </span>
          </div>

          {/* Confirm Password */}
          <div
            style={{
              position: "relative",
              marginBottom: "20px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 45px 12px 12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#110c0cff",
                fontSize: "14px",
              }}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#555" : "#E50914",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "0.3s",
            }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "15px",
              fontSize: "14px",
              color: message.includes("❌") ? "#ff4d4d" : "#4BB543",
              wordWrap: "break-word",
            }}
          >
            {message}
          </p>
        )}
      </div>

      <style>{`
        @media (max-width: 480px) {
          div[style*="max-width: 400px"] {
            padding: 20px !important;
          }
          input {
            font-size: 13px !important;
            padding: 10px 40px 10px 10px !important;
          }
          button {
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  );
}
