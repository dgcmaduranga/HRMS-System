const Employee = require("../models/Employee");
const Department = require("../models/Department");
const Leave = require("../models/Leave");
const Salary = require("../models/Salary");

exports.getDashboardStats = async (req, res) => {
  const totalEmployees = await Employee.countDocuments();
  const totalDepartments = await Department.countDocuments();

  // current month salary sum
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const salaryRecords = await Salary.find({ month, year });
  const monthlySalary = salaryRecords.reduce((sum, s) => sum + s.amount, 0);

  const leaveApplied = await Leave.countDocuments({ status: "Applied" });
  const leaveApproved = await Leave.countDocuments({ status: "Approved" });
  const leavePending = await Leave.countDocuments({ status: "Pending" });
  const leaveRejected = await Leave.countDocuments({ status: "Rejected" });

  res.json({
    totalEmployees,
    totalDepartments,
    monthlySalary,
    leaveApplied,
    leaveApproved,
    leavePending,
    leaveRejected,
  });
};
