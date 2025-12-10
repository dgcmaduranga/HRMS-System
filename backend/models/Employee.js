const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    employeeId: { type: String, unique: true },
    department: { type: String },
    designation: { type: String },
    salary: { type: Number, default: 0 },
    dob: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"], default: "male" },
    maritalStatus: {
      type: String,
      enum: ["single", "married", "other"],
      default: "single",
    },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
