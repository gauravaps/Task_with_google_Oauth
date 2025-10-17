import { useEffect, useState } from "react";
import API from "../axios";
import TaskList from "../components/TaskList";

export default function Profile() {
  const [user, setUser] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
    }
  };
 
  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "1000px",
        margin: "20px auto",
        padding: "20px",
        gap: "30px",
      }}
    >
      {/* Profile Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          background: "#f5f5f5",
          padding: "15px 20px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        {user?.picture && (
          <img
            src={user.picture}
            alt={user.name}
            referrerPolicy="no-referrer"
            style={{ width: "80px", height: "80px", borderRadius: "50%" }}
          />
        )}
        <div>
          <h2 style={{ margin: 0 }}>{user.name}</h2>
          <p style={{ margin: "4px 0", color: "#555" }}>{user.email}</p>
        </div>
      </div>

      {/* Normal User Task List */}
      {!user.isAdmin && (
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
            Your Tasks
          </h3>
          <TaskList adminMode={false} />
        </div>
      )}
    </div>
  );
}
