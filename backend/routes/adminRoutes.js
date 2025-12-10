const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const adminController = require("../controllers/adminController");
const employeeController = require("../controllers/employeeController");
const departmentController = require("../controllers/departmentController");
const leaveController = require("../controllers/leaveController");
const attendanceController = require("../controllers/attendanceController");
const salaryController = require("../controllers/salaryController");

// all admin routes protected
router.use(auth, role("admin"));

// Dashboard
router.get("/dashboard-stats", adminController.getDashboardStats);

// Employees
router.post("/employees", employeeController.createEmployee);
router.get("/employees", employeeController.getEmployees);
router.get("/employees/:id", employeeController.getEmployeeById);
router.put("/employees/:id", employeeController.updateEmployee);
router.delete("/employees/:id", employeeController.deleteEmployee);

// Departments
router.post("/departments", departmentController.createDepartment);
router.get("/departments", departmentController.getDepartments);
router.put("/departments/:id", departmentController.updateDepartment);
router.delete("/departments/:id", departmentController.deleteDepartment);

// Leaves (admin)
router.get("/leaves", leaveController.getAllLeaves);
router.put("/leaves/:id/approve", leaveController.approveLeave);
router.put("/leaves/:id/reject", leaveController.rejectLeave);

// Attendance (admin)
router.get("/attendance", attendanceController.getAttendance);

// Salary (admin)
router.post("/salaries", salaryController.addSalary);
router.get("/salaries", salaryController.getAllSalaries);

module.exports = router;
