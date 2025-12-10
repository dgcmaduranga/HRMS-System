const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/employee", employeeRoutes);

app.get("/", (req, res) => {
  res.send("HRMS API running");
});

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    // seed default admin IF not exists
    const adminEmail = "admin@example.com";
    const existing = await User.findOne({ email: adminEmail, role: "admin" });
    if (!existing) {
      const hashed = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashed,
        role: "admin",
      });
      console.log("Seeded default admin: admin@example.com / admin123");
    }

    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error(err));
