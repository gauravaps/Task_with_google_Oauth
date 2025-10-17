import { useEffect, useState } from "react";
import API from "../axios";
import TaskDetails from "./TaskDetails";

const TaskList = ({ adminMode = false ,refreshTrigger  }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [page, setPage] = useState(1);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  
  const fetchTasks = async () => {
    try {
      let url;
      if (adminMode) {
        url = `/api/get-all-filter-task?page=${page}&priority=${priorityFilter}`;
      } else {
        url = "/api/get-mytask";
      }

      const { data } = await API.get(url);
      setTasks(data.tasks);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, priorityFilter]); 
  

useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);



  // Normal user frontend filter
  const displayedTasks =
    adminMode || !priorityFilter
      ? tasks
      : tasks.filter((task) => task.priority === priorityFilter);

  const priorityColors = {
    Low: "#A0E7E5",
    Medium: "#FFD6A5",
    High: "#FFAEBC",
  };

  return (
    <div>
      {/* Filter */}
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

      {/* Task Cards */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          justifyContent: "center",
        }}
      >
        {displayedTasks.map((task) => (
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

      {/* Pagination only for admin */}
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
          onTaskUpdated={fetchTasks}
          adminMode={adminMode}
        />
      )}
    </div>
  );
};

export default TaskList;
