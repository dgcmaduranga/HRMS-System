HRMS System — Employee & Admin Management Portals

Complete Human Resource Management System with Attendance, Leaves, Salaries, Departments & Authentication.

📸 Project UI Preview

Add your screenshots inside /screenshots folder
Replace the sample images below with your own screenshots.

🔹 Admin Dashboard

  <img width="1680" height="1050" alt="Screenshot 2025-12-10 at 19 07 44" src="https://github.com/user-attachments/assets/1b54d4eb-f11e-4308-87bf-d54fc501a3d8" />

🔹 Employee Dashboard

   <img width="1680" height="1050" alt="Screenshot 2025-12-10 at 19 09 18" src="https://github.com/user-attachments/assets/d001c218-49fa-4e05-b030-cce90148ebeb" />

🔹 Leaves Management

   <img width="1680" height="1050" alt="Screenshot 2025-12-10 at 19 10 17" src="https://github.com/user-attachments/assets/68ecd922-a5cd-461c-86d0-344697a1907e" />

🔹 Salary View

  <img width="1680" height="1050" alt="Screenshot 2025-12-10 at 19 10 53" src="https://github.com/user-attachments/assets/a367e17f-4704-4874-8914-fd01372edb24" />

🔹 Login Page

<img width="1680" height="1050" alt="Screenshot 2025-12-10 at 19 11 29" src="https://github.com/user-attachments/assets/ed31b67c-c878-44c9-9f01-30a064b55d8d" />

🛠️ Tech Stack
Frontend (React + Tailwind CSS)

React.js (Vite)

React Router DOM

Tailwind CSS

Axios

LocalStorage (temporary storage – until backend integration)

Reusable UI components (Cards, Modals, Layouts)

Icons: React Icons

Backend (Node.js + Express + MongoDB)

Node.js

Express.js

MongoDB + Mongoose

JSON Web Token (JWT)

Bcrypt Password Hashing

REST API architecture

Role-Based Authentication (Admin + Employee)

Tools & DevOps

Postman (API Testing)

Git & GitHub (Source Control)

VS Code

Nodemon

MacOS Terminal / Windows CMD

📂 Project Folder Structure

HRMS-System/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── hrms-frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── components/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
│
└── screenshots/
    ├── admin-dashboard.png
    ├── employee-dashboard.png
    ├── leaves-page.png
    ├── salary.png
    └── login.png


🚀 Features
👨‍💼 Admin Portal

Manage employees

Manage departments

View attendance

View all leave requests

Approve / Reject leaves

Salary overview

Dashboard with analytics

Settings page (UI only)

👨‍🔧 Employee Portal

View attendance

Apply for leave

View salary details

Profile settings

Update display name

Theme (light/dark mode - optional)

🧪 API Testing with Postman

This project includes backend APIs tested using Postman.

🔥 How to import collection

Open Postman

Click Import

Select file:
HRMS-System.postman_collection.json

Set environment variable:
{{base_url}} = http://localhost:4000

🔐 Authentication Flow
Login from:
POST /api/auth/login

Copy the token

Go to Authorization → Bearer Token

Paste JWT token




👨‍🎓 Author

Charith Gamage









