import { useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function AdminPanel() {
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
    const [refreshList, setRefreshList] = useState(false);


  const handleTaskCreated = () => {
    setSuccessMessage("✅ Task created successfully!");
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

            {/* ✅ Success Message */}
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





import { useEffect, useState } from "react";
import API from "../axios";
import TaskDetails from "./TaskDetails";

const TaskList = ({ adminMode = false, refreshTrigger = false }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [page, setPage] = useState(1);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchTasks = async () => {
    try {
      let res;
      if (adminMode) {
        res = await API.get(
          `/api/get-all-filter-task?page=${page}&priority=${priorityFilter}`
        );
        setTasks(res.data.tasks);
        setTotalPages(res.data.totalPages);
      } else {
        res = await API.get("/api/get-mytask");
        setTasks(res.data.tasks || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, [page, priorityFilter, refreshTrigger]);

  const handleTaskUpdated = () => {
    fetchTasks();
    if (!adminMode) {
      setSuccessMessage("✅ Task updated successfully!");
      setTimeout(() => setSuccessMessage(""), 1500);
    }
  };

  const priorityColors = {
    Low: "#A0E7E5",
    Medium: "#FFD6A5",
    High: "#FFAEBC",
  };

  return (
    <div>
      {adminMode && (
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "6px", fontSize: "14px" }}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      )}

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
            maxWidth: "400px",
            margin: "0 auto 15px auto",
          }}
        >
          {successMessage}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          justifyContent: "center",
        }}
      >
        {tasks.map((task) => (
          <div
            key={task._id}
            onClick={() => setSelectedTask(task)}
            style={{
              backgroundColor: priorityColors[task.priority] || "#fff",
              padding: "15px",
              borderRadius: "12px",
              width: "250px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
            }}
          >
            <h3 style={{ marginBottom: "8px" }}>{task.title}</h3>
            <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p>Status: {task.status}</p>
          </div>
        ))}
      </div>

      {adminMode && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            style={{ marginRight: "10px" }}
          >
            Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            style={{ marginLeft: "10px" }}
          >
            Next
          </button>
        </div>
      )}

      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={handleTaskUpdated}
          adminMode={adminMode}
        />
      )}
    </div>
  );
};

export default TaskList;














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

  const handleLogout = async () => {
    try {
      await API.get("/auth/logout");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {user?.picture && (
        <img
          src={user.picture}
          alt={user.name}
          referrerPolicy="no-referrer"
          style={{ width: "80px", borderRadius: "50%" }}
        />
      )}

      <h2>Hi, {user.name}</h2>
      <p>{user.email}</p>

      <button
        onClick={handleLogout}
        style={{
          background: "tomato",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          marginTop: "10px",
        }}
      >
        Logout
      </button>

      {!user.isAdmin && (
        <div style={{ marginTop: "40px" }}>
          <h3>Your Tasks</h3>
          <TaskList adminMode={false} />
        </div>
      )}
    </div>
  );
}




import { useState, useEffect } from "react";
import API from "../axios";

const TaskDetails = ({ task, onClose, onTaskUpdated, adminMode = false }) => {
  const [status, setStatus] = useState(task.status);
  const [users, setUsers] = useState([]);
  const [assignedUser, setAssignedUser] = useState(task.assignedTo || "");

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

  const handleAssign = async (e) => {
    const userId = e.target.value;
    setAssignedUser(userId);
    try {
      await API.put(`/api/assign-task/${task._id}`, { userId });
      alert("✅ Task assigned!");
      onTaskUpdated && onTaskUpdated();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to assign task");
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
        <h2>{task.title}</h2>
        <p>{task.description}</p>
        <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>

        <div style={{ margin: "10px 0" }}>
          <label>Status: </label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={handleStatusChange}
            style={{
              background: "#4caf50",
              color: "#fff",
              padding: "6px 12px",
              border: "none",
              borderRadius: "6px",
              marginLeft: "10px",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
          >
            Update
          </button>
        </div>

        {adminMode && (
          <>
            <div style={{ margin: "10px 0" }}>
              <label>Assign to User: </label>
              <select value={assignedUser} onChange={handleAssign}>
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Delete button only visible to admin */}
            <button
              onClick={handleDelete}
              style={{ background: "tomato", color: "#fff", marginTop: "10px" }}
            >
              Delete Task
            </button>
          </>
        )}

        <button
          onClick={onClose}
          style={{ marginTop: "10px", marginLeft: "10px" }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TaskDetails;

