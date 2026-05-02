const Task = require("../models/Task");
const mongoose = require("mongoose");

// Admin: create & assign task
exports.createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate } = req.body;

    if (!title) return res.status(400).json({ message: "Task title is required" });
    if (!assignedTo) return res.status(400).json({ message: "assignedTo is required" });

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      priority: priority || "medium",
      dueDate: dueDate || null,
      createdBy: req.user.id,
    });

    const populated = await task.populate([
      { path: "assignedTo", select: "name email" },
      { path: "project", select: "name" },
      { path: "createdBy", select: "name email" },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to create task", error: err.message });
  }
};

// Member: get own tasks | Admin: get all tasks
exports.getMyTasks = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "admin") {
      query = {}; // admin sees all
    } else {
      query = { assignedTo: new mongoose.Types.ObjectId(req.user.id) };
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .populate("project", "name")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks", error: err.message });
  }
};

// Get all tasks (admin only)
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .populate("project", "name")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks", error: err.message });
  }
};

// Get tasks by project
exports.getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({
      project: new mongoose.Types.ObjectId(req.params.projectId),
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch project tasks", error: err.message });
  }
};

// Update task status (member can update their own, admin can update any)
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Members can only update their own tasks
    if (
      req.user.role !== "admin" &&
      task.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    const allowedUpdates =
      req.user.role === "admin"
        ? ["status", "title", "description", "assignedTo", "priority", "dueDate", "project"]
        : ["status"];

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updated = await Task.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate("assignedTo", "name email")
      .populate("project", "name")
      .populate("createdBy", "name email");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update task", error: err.message });
  }
};

// Admin: delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task", error: err.message });
  }
};

// Dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const baseQuery = isAdmin ? {} : { assignedTo: userId };
    const now = new Date();

    const [total, todo, inProgress, done, overdue] = await Promise.all([
      Task.countDocuments(baseQuery),
      Task.countDocuments({ ...baseQuery, status: "todo" }),
      Task.countDocuments({ ...baseQuery, status: "in-progress" }),
      Task.countDocuments({ ...baseQuery, status: "done" }),
      Task.countDocuments({
        ...baseQuery,
        status: { $ne: "done" },
        dueDate: { $lt: now },
      }),
    ]);

    res.json({ total, todo, inProgress, done, overdue });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
};
