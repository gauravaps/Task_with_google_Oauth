import { useState, useEffect } from "react";
import API from "../axios";

const TaskDetails = ({ task, onClose, onTaskUpdated, adminMode = false }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate.slice(0, 10)); 
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);
  const [assignedUser, setAssignedUser] = useState(task.assignedTo?._id || "");
  const [users, setUsers] = useState([]);

  // Fetch all users if adminMode
  useEffect(() => {
    if (adminMode) {
      const fetchUsers = async () => {
        try {
          const { data } = await API.get("/auth/all-users");
          setUsers(data.users);
        } catch (err) {
          console.error(err);
        }
      };
      fetchUsers();
    }
  }, [adminMode]);

  // Handle full task update (Admin)
  const handleFullUpdate = async () => {
    try {
      const payload = {
        title,
        description,
        dueDate,
        priority,
        status,
        assignedTo: assignedUser || null,
      };

      await API.put(`/api/update-task/${task._id}`, payload);
      alert("✅ Task updated successfully!");
      onTaskUpdated && onTaskUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update task");
    }
  };

  // Handle status update only (Normal user)
  const handleStatusChange = async () => {
    try {
      await API.put(`/api/update-status/${task._id}`, { status });
      alert("✅ Status updated!");
      onTaskUpdated && onTaskUpdated();
      onClose();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure to delete this task?")) return;
    try {
      await API.delete(`/api/delete-task/${task._id}`);
      alert("🗑️ Task deleted!");
      onTaskUpdated && onTaskUpdated();
      onClose();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to delete task");
    }
  };

  return (
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
        }}
      >
        {/* Title */}
        <div style={{ marginBottom: "10px" }}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!adminMode}
            style={{
              width: "100%",
              padding: "6px 8px",
              marginTop: "4px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: "10px" }}>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!adminMode}
            style={{
              width: "100%",
              padding: "6px 8px",
              marginTop: "4px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Due Date */}
        <div style={{ marginBottom: "10px" }}>
          <label>Due Date:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={!adminMode}
            style={{
              width: "100%",
              padding: "6px 8px",
              marginTop: "4px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Priority */}
        <div style={{ marginBottom: "10px" }}>
          <label>Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={!adminMode}
            style={{
              width: "100%",
              padding: "6px 8px",
              marginTop: "4px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Status */}
        <div style={{ marginBottom: "10px" }}>
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 8px",
              marginTop: "4px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Assign User (Admin only) */}
        {adminMode && (
          <div style={{ marginBottom: "10px" }}>
            <label>Assign to User:</label>
            <select
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                marginTop: "4px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Buttons */}
        <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between" }}>
          {adminMode ? (
            <>
              <button
                onClick={handleFullUpdate}
                style={{
                  background: "#4caf50",
                  color: "#fff",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Update Task
              </button>
              <button
                onClick={handleDelete}
                style={{
                  background: "tomato",
                  color: "#fff",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Delete Task
              </button>
            </>
          ) : (
            <button
              onClick={handleStatusChange}
              style={{
                background: "#4caf50",
                color: "#fff",
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Update Status
            </button>
          )}

          <button
            onClick={onClose}
            style={{
              background: "#ccc",
              color: "#000",
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
