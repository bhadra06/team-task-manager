const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");

router.post("/", authMiddleware, adminMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.get("/:id", authMiddleware, getProject);
router.put("/:id", authMiddleware, adminMiddleware, updateProject);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProject);

module.exports = router;
