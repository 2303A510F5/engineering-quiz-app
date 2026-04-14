# 🧠 Engineering Quiz Application

A premium, full-stack engineering assessment platform designed for students and professionals to test their knowledge across core engineering domains. Built with the **MERN** stack (MongoDB, Express, React, Node.js), this application features a sophisticated analytics dashboard, real-time feedback, and a robust question bank.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

---

## ✨ Key Features

- **🎯 Specialized Subjects**: 90+ high-quality questions covering:
  - **Operating Systems**: Processes, Memory Management, Deadlocks, etc.
  - **Computer Networks**: OSI Model, Protocols, IP Addressing, etc.
  - **Operations Research**: Simplex Method, Queuing Theory, Optimization, etc.
- **📊 Advanced Analytics**: Interactive charts (Chart.js) visualizing your performance trends, subject-wise accuracy, and progress over time.
- **🔐 Secure Authentication**: JWT-based login and signup system to persist your progress and history.
- **⚡ Dynamic Difficulty**: Questions categorized into Easy, Medium, and Hard levels for a tailored learning experience.
- **📖 Instant Explanations**: Detailed reasoning provided for every answer to reinforce learning from mistakes.
- **📱 Responsive UI**: A sleek, modern dashboard built with Tailwind CSS and Lucide icons, fully optimized for all devices.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Routing**: React Router DOM v7
- **Styling**: Vanilla CSS / Tailwind (Modern Glassmorphism Design)
- **Icons**: Lucide React
- **Charts**: Chart.js & React-Chartjs-2

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JSON Web Tokens (JWT) & BcryptJS
- **Dev Tool**: MongoDB Memory Server (Optional for testing)

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/engineering-quiz-app.git
   cd engineering-quiz-app
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

You can run both servers simultaneously or separately:

**Start Backend:**
```bash
# Inside /backend
node server.js
```

**Start Frontend:**
```bash
# Inside /frontend
npm run dev
```

---

## 📁 Project Structure

```text
engineering-quiz-app/
├── backend/            # Express Server & API
│   ├── controllers/    # Request Handlers
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # API Endpoints
│   ├── middleware/     # Auth & Error Handlers
│   └── mockData.js     # 90+ Seeded Questions
├── frontend/           # React Application
│   ├── src/
│   │   ├── pages/      # Dashboard, Quiz, Auth
│   │   ├── components/ # Reusable UI pieces
│   │   └── App.jsx     # Main Router
└── README.md
```

---


