// controllers/adminController.js
import User from "../models/User.js";
import Department from "../models/Department.js";
import Leave from "../models/Leave.js";
import Salary from "../models/Salary.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Employees / Departments
    const totalEmployeesPromise = User.countDocuments({ role: "employee" });
    const totalDepartmentsPromise = Department.countDocuments();

    // Leaves
    const leaveAppliedPromise = Leave.countDocuments(); // all leaves
    const leaveApprovedPromise = Leave.countDocuments({ status: "approved" });
    const leavePendingPromise = Leave.countDocuments({ status: "pending" });
    const leaveRejectedPromise = Leave.countDocuments({ status: "rejected" });

    // Salary (sum of all salaries – later month filter add කරන්න පුළුවන්)
    const monthlySalaryPromise = Salary.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$basic" }, // basic + allowances include කරන්න ඕනනම් change කරන්න
        },
      },
    ]);

    const [
      totalEmployees,
      totalDepartments,
      leaveApplied,
      leaveApproved,
      leavePending,
      leaveRejected,
      monthlySalaryAgg,
    ] = await Promise.all([
      totalEmployeesPromise,
      totalDepartmentsPromise,
      leaveAppliedPromise,
      leaveApprovedPromise,
      leavePendingPromise,
      leaveRejectedPromise,
      monthlySalaryPromise,
    ]);

    const monthlySalary = monthlySalaryAgg[0]?.total || 0;

    res.json({
      totalEmployees,
      totalDepartments,
      monthlySalary,
      leaveApplied,
      leaveApproved,
      leavePending,
      leaveRejected,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ msg: "Failed to load dashboard stats" });
  }
};
