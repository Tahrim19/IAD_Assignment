const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

// Enable CORS for frontend
app.use(
  cors({
    origin: "https://iad-assignment.vercel.app", // Change to your deployed frontend URL
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type",
    credentials: true, // Allow credentials if needed
  })
);

let projects = [
  { id: 1, name: "Project Alpha" },
  { id: 2, name: "Project Beta" },
];

// Ensure `nextId` always gets the next available ID
let nextId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1;

// 🟢 Get all projects
app.get("/api/projects", (req, res) => {
  res.json(projects);
});

// 🟢 Get total count of projects
app.get("/api/projects/count", (req, res) => {
  res.json({ count: projects.length });
});

// 🟢 Add new project
app.post("/api/projects", (req, res) => {
  const { name } = req.body;

  if (!name || name.length < 3) {
    return res.status(400).json({ status: "error", message: "Project name must be at least 3 characters" });
  }

  const exists = projects.some((p) => p.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    return res.status(400).json({ status: "error", message: "Project name already exists" });
  }

  const newProject = { id: nextId++, name };
  projects.push(newProject);
  res.status(201).json(newProject);
});

// 🟢 Update project
app.put("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || name.length < 3) {
    return res.status(400).json({ status: "error", message: "Project name must be at least 3 characters" });
  }

  const project = projects.find((p) => p.id === Number(id));
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  // Prevent duplicate project names (case-insensitive)
  const nameExists = projects.some(
    (p) => p.name.toLowerCase() === name.toLowerCase() && p.id !== Number(id)
  );
  if (nameExists) {
    return res.status(400).json({ status: "error", message: "Project name already exists" });
  }

  project.name = name; // Update project name
  res.json(project);
});

// 🟢 Delete project
app.delete("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const project = projects.find((p) => p.id === Number(id));

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  projects = projects.filter((p) => p.id !== Number(id)); // Remove project
  res.json(project); // Return deleted project
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
