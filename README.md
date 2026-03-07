# 🧠 Kairon AI

**The Ultimate AI-Powered Learning Platform**

## 🚀 Overview

**Kairon AI** is a next-generation study assistant designed to accelerate mastery of any subject. Inspired by the wise tutor Chiron, it leverages advanced Generative AI to transform raw educational content—textbooks, lecture recordings, videos, and code—into interactive learning experiences.

Stop passively reading. Start actively mastering.

## ✨ Key Features

### 📚 Intelligent Ingestion
- **Multi-Modal Support**: Upload PDFs, Word docs, Audio files, or paste YouTube links.
- **Vision Support**: Snap photos of handwritten notes or diagrams; Kairon digests them as text.
- **Auto-Seeding**: Enter a topic, and Kairon will generate the study material for you.

### 🧠 Active Recall Tools
- **SRS Flashcards**: Automatically generates smart flashcards with a Spaced Repetition System algorithm to hack memory retention.
- **AI Quizzes (MCQ)**: Test your knowledge with instant feedback and explanations.
- **Magic Login**: Seamless authentication experience—verify your email and get logged in instantly without re-entering credentials.

### 💡 Deep Understanding
- **Socratic AI Tutor**: Chat contextually with your notes. The tutor guides you to answers rather than just giving them.
- **Concept Maps**: Visualize complex relationships between topics with interactive, dynamic graphs (powered by D3.js).
- **Semantic Search**: Stop keyword hunting. Find information based on *meaning* and context.

### 🛠️ Specialized Tools
- **Code Analysis**: Paste code to get instant algorithms, pseudocode, and flowcharts.
- **Voice Mode**: Speak to Kairon and hear responses for on-the-go learning.
- **Gamified Progress**: Earn XP, maintain daily streaks, and level up as you learn.
- **Study Planner**: Get custom day-by-day schedules generated based on your material and timeframe.

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Visualization**: D3.js (Concept Maps), Mermaid.js (Flowcharts)
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) & Firebase (Social Auth)
- **Email**: Nodemailer (SMTP)

### AI Engine
- **Core Model**: Google Gemini Pro & Flash (`@google/genai`)
- **Capabilities**: Text generation, Vision analysis, Audio transcription, Embeddings.

---

## 🛠️ Installation & Setup

Follow these steps to run Kairon AI locally.

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI
- Google Gemini API Key
- Firebase Project (for social login)

### 1. Clone the Repository
git clone [https://github.com/sarim-aliii/Kairon-AI-Personalized-Learning-Platform.git](https://github.com/sarim-aliii/Kairon-AI-Personalized-Learning-Platform.git)
cd Kairon-AI-Personalized-Learning-Platform

### 2. Backend Configuration
Navigate to the server directory and install dependencies.
cd server
npm install
Create a .env file in /server based on .env.example:

PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
FRONTEND_URL=http://localhost:3000
FIREBASE_SERVICE_ACCOUNT_JSON={...your_firebase_admin_sdk_json...}

Start the backend server:
npm run dev

### 3. Frontend Configuration
Open a new terminal, navigate to the root directory, and install dependencies.

# From the project root
npm install
Create a .env file in the root directory:

Code snippet

VITE_API_BASE_URL=http://localhost:5001/api
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
Start the frontend development server:

npm run dev
Visit http://localhost:3000 to start learning!


🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📩 Contact & Support
Questions, feedback, or feature requests?

Support Email: kaironapp.ai@gmail.com

Project Link: https://github.com/sarim-aliii/Kairon-AI-Personalized-Learning-Platform

Built with ❤️ by the Kairon AI Team.