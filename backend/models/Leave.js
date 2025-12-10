const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    type: { type: String, default: "Annual" },
    reason: { type: String },
    status: {
      type: String,
      enum: ["Applied", "Approved", "Pending", "Rejected"],
      default: "Applied",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", leaveSchema);
