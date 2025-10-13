import { useState, useEffect } from "react";
import API from "../axios";

const TaskForm = ({ onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
    assignedTo: "", 
  });
 
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get("/auth/all-users");
        setUsers(data.users);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/api/create-task", formData);
      alert("✅ Task created successfully!");
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "low",
        assignedTo: "",
      });
      onTaskCreated && onTaskCreated();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "❌ Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form" style={styles.form}>
      <input
        type="text"
        name="title"
        placeholder="Task Title"
        value={formData.title}
        onChange={handleChange}
        required
        style={styles.input}
      />
      <textarea
        name="description"
        placeholder="Task Description"
        value={formData.description}
        onChange={handleChange}
        required
        style={styles.textarea}
      ></textarea>
      <input
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
        required
        style={styles.input}
      />
      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        style={styles.select}
      >
        <option value="Low">Low Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="High">High Priority</option> 
      </select>


      <select
        name="assignedTo"
        value={formData.assignedTo}
        onChange={handleChange}
        required
        style={styles.select}
      >
        <option value="">Assign to User</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.name} ({u.email})
          </option>
        ))}
      </select>

      <button type="submit" style={styles.button}>Create Task</button>
    </form>
  );
};

const styles = {
  form: {
    maxWidth: "400px",
    margin: "20px auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    background: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  textarea: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    minHeight: "80px",
  },
  select: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    padding: "10px",
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "0.3s",
  },
};

export default TaskForm;
