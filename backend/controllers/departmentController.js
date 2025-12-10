const Department = require("../models/Department");

exports.createDepartment = async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json({ msg: "Department created", department: dept });
  } catch (err) {
    res.status(400).json({ msg: "Create department failed", error: err.message });
  }
};

exports.getDepartments = async (req, res) => {
  const depts = await Department.find().sort({ createdAt: -1 });
  res.json(depts);
};

exports.updateDepartment = async (req, res) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!dept) return res.status(404).json({ msg: "Department not found" });
    res.json({ msg: "Department updated", department: dept });
  } catch (err) {
    res.status(400).json({ msg: "Update department failed", error: err.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  await Department.findByIdAndDelete(req.params.id);
  res.json({ msg: "Department deleted" });
};
