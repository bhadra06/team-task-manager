const express = require("express");
const router = express.Router();
const {
  createTask,
  getMyTasks,
  getAllTasks,
  getTasksByProject,
  updateTask,
  deleteTask,
  getDashboardStats,
} = require("../controllers/taskController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");

router.post("/", authMiddleware, adminMiddleware, createTask);
router.get("/my", authMiddleware, getMyTasks);
router.get("/all", authMiddleware, adminMiddleware, getAllTasks);
router.get("/stats", authMiddleware, getDashboardStats);
router.get("/project/:projectId", authMiddleware, getTasksByProject);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, adminMiddleware, deleteTask);

module.exports = router;
