const Project = require("../models/Project");
const mongoose = require("mongoose");

// Admin: create project
exports.createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    if (!name) return res.status(400).json({ message: "Project name is required" });

    const project = await Project.create({
      name,
      description,
      members: members || [],
      createdBy: req.user.id,
    });

    const populated = await project.populate("members", "name email role");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to create project", error: err.message });
  }
};

// Get all projects (admin sees all, member sees theirs)
exports.getProjects = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== "admin") {
      query = { members: new mongoose.Types.ObjectId(req.user.id) };
    }

    const projects = await Project.find(query)
      .populate("members", "name email role")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects", error: err.message });
  }
};

// Get single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members", "name email role")
      .populate("createdBy", "name email");

    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch project", error: err.message });
  }
};

// Admin: update project
exports.updateProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, members },
      { new: true }
    ).populate("members", "name email role");

    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to update project", error: err.message });
  }
};

// Admin: delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete project", error: err.message });
  }
};
