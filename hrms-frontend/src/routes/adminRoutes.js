import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ...existing routes...

router.get(
  "/dashboard-stats",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

export default router;
