const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    month: { type: Number, required: true }, // 1–12
    year: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Salary", salarySchema);
