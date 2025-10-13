import { useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function AdminPanel() {
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [refreshList, setRefreshList] = useState(false);

  const handleTaskCreated = () => {
    setSuccessMessage("✅ Task created successfully!");
    setRefreshList(prev => !prev); 
    setTimeout(() => {
      setSuccessMessage("");
      setShowForm(false); 
    }, 1500);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>👑 Admin Dashboard</h1>

      <button
        onClick={() => setShowForm(true)}
        style={{
          background: "#4caf50",
          color: "#fff",
          padding: "10px 15px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        ➕ Create Task
      </button>

      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "12px",
              width: "400px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowForm(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "tomato",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>

            {successMessage && (
              <div
                style={{
                  background: "#d4edda",
                  color: "#155724",
                  padding: "10px",
                  borderRadius: "6px",
                  marginBottom: "10px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {successMessage}
              </div>
            )}

            <TaskForm onTaskCreated={handleTaskCreated} />
          </div>
        </div>
      )}

      <hr style={{ margin: "20px 0" }} />

      <TaskList adminMode={true} refreshTrigger={refreshList} />
    </div>
  );
}
