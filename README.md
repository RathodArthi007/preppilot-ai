
# PrepPilot AI 🚀

An AI-powered placement preparation platform designed to help students organize and improve their placement preparation.

## ✨ Features

- **Dashboard:** Track preparation progress and recent activities.
- **DSA Tracker:** Add coding problems, track solved questions, and monitor difficulty levels.
- **Study Planner:** Create study tasks, set priorities, and track completion.
- **Mistake Journal:** Record mistakes and review areas that need improvement.
- **Mock Interview:** Practice interview questions and track your scores.
- **Resume Analyzer:** Upload a PDF resume, review detected skills, and compare them with job descriptions.
- **Dark and Light Mode:** Switch between themes.

## 🛠️ Technologies Used

### Frontend
- React.js
- JavaScript
- HTML
- CSS
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- REST API

## 📁 Project Structure

```text
preppilot-ai/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   ├── api.js
│   └── index.css
├── package.json
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/RathodArthi007/preppilot-ai.git
cd preppilot-ai
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the backend folder.

Add your own MongoDB connection string and port configuration:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Never upload your actual `.env` file or database credentials.

### 5. Start the backend

```bash
node server.js
```

### 6. Start the frontend

Open another terminal in the project root:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 🎯 Project Goal

PrepPilot AI aims to make placement preparation more organized by bringing DSA tracking, study planning, interview practice, mistake tracking, and resume analysis together in one platform.

## 👩‍💻 Developer

**GitHub:** [RathodArthi007](https://github.com/RathodArthi007)

## 📄 License

This project is created for educational and portfolio purposes.
