const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const employeeController = require("../controllers/employeeController");
const leaveController = require("../controllers/leaveController");
const attendanceController = require("../controllers/attendanceController");
const salaryController = require("../controllers/salaryController");

// all employee self routes
router.use(auth, role("employee"));

// profile
router.get("/me", employeeController.getMyProfile);

// leaves
router.post("/leaves", leaveController.applyLeave);
router.get("/leaves", leaveController.getMyLeaves);

// attendance
router.post("/attendance", attendanceController.markAttendance);
router.get("/attendance", attendanceController.getMyAttendance);

// salary
router.get("/salary", salaryController.getMySalary);

module.exports = router;
