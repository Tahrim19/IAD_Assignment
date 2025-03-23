const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let projects = [
  { id: 1, name: "Project Alpha" },
  { id: 2, name: "Project Beta" },
];

let nextId = 1;

// Get all projects
app.get("/api/projects", (req, res) => {
  res.json(projects);
});

// Get total count of projects
app.get("/api/projects/count", (req, res) => {
  res.json({ count: projects.length });
});

// Add new project
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

// Update project
app.put("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || name.length < 3) {
    return res.status(400).json({ status: "error", message: "Project name must be at least 3 characters" });
  }

  // Find project index
  const projectIndex = projects.findIndex((p) => p.id === parseInt(id));
  if (projectIndex === -1) {
    return res.status(404).json({ message: "Project not found" });
  }

  // Update the project name
  projects[projectIndex] = { ...projects[projectIndex], name };

  res.json(projects[projectIndex]); // Send the updated project
});


// Delete project
app.delete("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex((p) => p.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ message: "Project not found" });
  }

  const deletedProject = projects.splice(index, 1)[0];
  res.json(deletedProject);
});

app.put("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || name.length < 3) {
    return res.status(400).json({ status: "error", message: "Project name must be at least 3 characters" });
  }

  // Check for duplicates (case-insensitive)
  const exists = projects.some((p) => p.name.toLowerCase() === name.toLowerCase() && p.id !== parseInt(id));
  if (exists) {
    return res.status(400).json({ status: "error", message: "Project name already exists" });
  }

  const project = projects.find((p) => p.id === parseInt(id));
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  project.name = name;
  res.json(project);
});


app.listen(5000, () => console.log("Server running on port 5000"));
