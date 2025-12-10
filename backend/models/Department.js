const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String },
    head: { type: String },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
