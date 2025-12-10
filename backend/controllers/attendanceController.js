const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// employee mark
exports.markAttendance = async (req, res) => {
  const emp = await Employee.findOne({ email: req.user.email });
  if (!emp) return res.status(404).json({ msg: "Employee not found" });

  const { date, status } = req.body; // date string yyyy-mm-dd

  const att = await Attendance.create({
    employee: emp._id,
    date,
    status: status || "Present",
  });

  res.status(201).json({ msg: "Attendance marked", attendance: att });
};

// employee view own
exports.getMyAttendance = async (req, res) => {
  const emp = await Employee.findOne({ email: req.user.email });
  if (!emp) return res.status(404).json({ msg: "Employee not found" });

  const list = await Attendance.find({ employee: emp._id }).sort({ date: -1 });
  res.json(list);
};

// admin filter
exports.getAttendance = async (req, res) => {
  const { employeeId, date } = req.query;
  let filter = {};
  if (employeeId) filter.employee = employeeId;
  if (date) filter.date = new Date(date);

  const list = await Attendance.find(filter)
    .populate("employee")
    .sort({ date: -1 });

  res.json(list);
};
