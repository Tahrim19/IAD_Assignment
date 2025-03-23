import { useState, useEffect } from "react";
import axios from "axios";
import "./app.css";  // Import CSS file

const API_URL = "http://localhost:5000/api/projects";

function App() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(API_URL);
      setProjects(res.data);
      const countRes = await axios.get(`${API_URL}/count`);
      setCount(countRes.data.count);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async () => {
    if (!newProject) return;

    try {
      if (editingProject) {
        const res = await axios.put(`${API_URL}/${editingProject.id}`, { name: newProject });
        setProjects(projects.map((p) => (p.id === editingProject.id ? res.data : p)));
        setEditingProject(null);
      } else {
        const res = await axios.post(API_URL, { name: newProject });
        setProjects([...projects, res.data]);
      }

      setNewProject("");
      setError("");
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving project");
    }
  };

  const startEditing = (project) => {
    setNewProject(project.name);
    setEditingProject(project);
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
      fetchProjects();
    } catch (err) {
      console.error("Error deleting project", err);
    }
  };

  return (
    <div className="container">
      <h1>Projects ({count})</h1>

      <input
        type="text"
        value={newProject}
        onChange={(e) => setNewProject(e.target.value)}
        placeholder="Enter project name"
      />
      <button className={editingProject ? "update" : "add"} onClick={handleSubmit}>
        {editingProject ? "Update Project" : "Add Project"}
      </button>
      {error && <p className="error">{error}</p>}

      <button className="refresh" onClick={fetchProjects}>Refresh Projects</button>

      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            {project.name}{" "}
            <div>
              <button className="update" onClick={() => startEditing(project)}>Edit</button>
              <button className="delete" onClick={() => deleteProject(project.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
