const Leave = require("../models/Leave");
const Employee = require("../models/Employee");

// employee apply
exports.applyLeave = async (req, res) => {
  try {
    const { fromDate, toDate, type, reason } = req.body;

    const employee = await Employee.findOne({ email: req.user.email });
    if (!employee) return res.status(404).json({ msg: "Employee not found" });

    const leave = await Leave.create({
      employee: employee._id,
      fromDate,
      toDate,
      type,
      reason,
      status: "Applied",
    });

    res.status(201).json({ msg: "Leave applied", leave });
  } catch (err) {
    res.status(400).json({ msg: "Apply leave failed", error: err.message });
  }
};

// employee view own
exports.getMyLeaves = async (req, res) => {
  const emp = await Employee.findOne({ email: req.user.email });
  if (!emp) return res.status(404).json({ msg: "Employee not found" });

  const leaves = await Leave.find({ employee: emp._id }).sort({ createdAt: -1 });
  res.json(leaves);
};

// admin all leaves
exports.getAllLeaves = async (req, res) => {
  const leaves = await Leave.find().populate("employee").sort({ createdAt: -1 });
  res.json(leaves);
};

exports.approveLeave = async (req, res) => {
  const leave = await Leave.findByIdAndUpdate(
    req.params.id,
    { status: "Approved" },
    { new: true }
  );
  res.json({ msg: "Leave approved", leave });
};

exports.rejectLeave = async (req, res) => {
  const leave = await Leave.findByIdAndUpdate(
    req.params.id,
    { status: "Rejected" },
    { new: true }
  );
  res.json({ msg: "Leave rejected", leave });
};
