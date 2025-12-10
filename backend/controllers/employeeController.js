// backend/controllers/employeeController.js
const Employee = require("../models/Employee");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ---------- helper: auto-generate employeeId safely ----------
async function generateEmployeeId() {
  // Last created employee එක ගන්නවා
  const lastEmp = await Employee.findOne().sort({ createdAt: -1 });

  if (!lastEmp || !lastEmp.employeeId) {
    return "EMP0001";
  }

  const lastNumber = parseInt(lastEmp.employeeId.replace("EMP", ""), 10) || 0;
  const nextNumber = lastNumber + 1;

  return "EMP" + nextNumber.toString().padStart(4, "0");
}

// ========== ADMIN SIDE ==========

// POST /api/admin/employees
exports.createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      department,
      designation,
      salary,
      dob,
      gender,
      maritalStatus,
      status,
      password,
    } = req.body;

    if (!name || !email || !department || !designation) {
      return res
        .status(400)
        .json({ msg: "Name, email, department and designation are required" });
    }

    if (!password) {
      return res.status(400).json({ msg: "Password is required" });
    }

    // ---- check duplicates ----
    const existsEmp = await Employee.findOne({ email });
    if (existsEmp) {
      return res
        .status(400)
        .json({ msg: "Employee with this email already exists" });
    }

    const existsUser = await User.findOne({ email, role: "employee" });
    if (existsUser) {
      return res
        .status(400)
        .json({ msg: "Employee user already exists for this email" });
    }

    // ---- generate employeeId ----
    const employeeId = await generateEmployeeId();

    // ---- create Employee document ----
    const employee = await Employee.create({
      name,
      email,
      employeeId,
      department,
      designation,
      salary: Number(salary) || 0,
      dob,
      gender,
      maritalStatus,
      status: status || "Active",
    });

    // ---- create User document for login ----
    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      role: "employee",
    });

    return res.status(201).json({ msg: "Employee created", employee });
  } catch (err) {
    console.error("Create employee error:", err);
    return res
      .status(400)
      .json({ msg: "Create employee failed", error: err.message });
  }
};

// GET /api/admin/employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    return res.json(employees);
  } catch (err) {
    console.error("Get employees error:", err);
    return res.status(500).json({ msg: "Failed to load employees" });
  }
};

// GET /api/admin/employees/:id
exports.getEmployeeById = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ msg: "Employee not found" });
    return res.json(emp);
  } catch (err) {
    console.error("Get employee by id error:", err);
    return res.status(400).json({ msg: "Invalid employee id" });
  }
};

// PUT /api/admin/employees/:id
exports.updateEmployee = async (req, res) => {
  try {
    const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!emp) return res.status(404).json({ msg: "Employee not found" });

    return res.json({ msg: "Employee updated", employee: emp });
  } catch (err) {
    console.error("Update employee error:", err);
    return res.status(400).json({ msg: "Update failed", error: err.message });
  }
};

// DELETE /api/admin/employees/:id
exports.deleteEmployee = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ msg: "Employee not found" });

    // Delete login user record as well
    await User.deleteOne({ email: emp.email, role: "employee" });
    await emp.deleteOne();

    return res.json({ msg: "Employee deleted" });
  } catch (err) {
    console.error("Delete employee error:", err);
    return res.status(400).json({ msg: "Delete failed", error: err.message });
  }
};

// ========== EMPLOYEE SELF DATA ==========

// GET /api/employee/me  (protected with auth middleware)
exports.getMyProfile = async (req, res) => {
  try {
    // 🔑 authMiddleware වලින් දාපු decoded token: { id, role }
    const userId = req.user.id;

    // User collection එකෙන් email ගන්නවා
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // ඒ email එකට match වෙන Employee එක ගන්නවා
    const emp = await Employee.findOne({ email: user.email });

    if (!emp) return res.status(404).json({ msg: "Employee not found" });

    return res.json(emp);
  } catch (err) {
    console.error("Get my profile error:", err);
    return res.status(500).json({ msg: "Failed to load profile", error: err.message });
  }
};
