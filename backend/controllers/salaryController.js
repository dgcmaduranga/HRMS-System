const Salary = require("../models/Salary");
const Employee = require("../models/Employee");

// admin add salary record
exports.addSalary = async (req, res) => {
  const { employeeId, month, year, amount } = req.body;

  const emp = await Employee.findById(employeeId);
  if (!emp) return res.status(404).json({ msg: "Employee not found" });

  const record = await Salary.create({
    employee: emp._id,
    month,
    year,
    amount,
  });

  res.status(201).json({ msg: "Salary added", salary: record });
};

// admin all salaries
exports.getAllSalaries = async (req, res) => {
  const all = await Salary.find().populate("employee").sort({ year: -1, month: -1 });
  res.json(all);
};

// employee my salary
exports.getMySalary = async (req, res) => {
  const emp = await Employee.findOne({ email: req.user.email });
  if (!emp) return res.status(404).json({ msg: "Employee not found" });

  const list = await Salary.find({ employee: emp._id }).sort({ year: -1, month: -1 });
  res.json(list);
};
