# AI Resume Screening system 🚀

## 🎯 Overview..
AI-powered SaaS platform that analyzes, enhances, and optimizes resumes for job applications.
- **Resume Parsing** (PDF/DOCX)
- **AI Enhancement** (ATS-optimized, impact-focused)
- **JD Matching** (0-100% score)
- **Skill Gap Analysis**
- **Multiple Resume Versions**
- **Mock Interviews**

**Live Demo**: [Coming soon]

## 🛠️ Tech Stack
```
Frontend: React 18 + Vite + TailwindCSS + React Router
Backend:  Node.js + Express + MongoDB (Mongoose)
AI:       OpenAI GPT-4o-mini
Auth:     JWT + Google OAuth
Parsing:  pdf-parse + mammoth
Deploy:   Vercel (FE) + Render (BE) + MongoDB Atlas
```

## 📁 Project Structure
```
Ai resume system/
├── backend/          # Express API server
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
├── frontend/         # React Vite app
│   ├── src/
│   ├── public/
│   └── package.json
├── .env.example
├── .gitignore
├── README.md
└── TODO.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- OpenAI API key

### 1. Clone & Install
```bash
git clone <repo>
cd "Ai resume system"
```

### 2. Backend
```bash
cd backend
cp .env.example .env
# Add MONGO_URI, OPENAI_API_KEY, JWT_SECRET
npm install
npm start
```
*Server runs on http://localhost:5000*

### 3. Frontend
```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```
*App runs on http://localhost:5173*

### 4. Test Flow
1. Signup/Login
2. Upload resume (PDF/DOCX)
3. Paste JD → Get match score
4. Download enhanced resume

## 🌐 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/resume/upload` | Parse resume |
| POST | `/api/resume/enhance` | AI enhancement |
| POST | `/api/match/jd` | JD matching |

## 🧪 Testing
```bash
# Backend
npm test

# Frontend
npm run test:unit
npm run test:e2e
```

## 🔐 Environment Variables
```bash
MONGO_URI=mongodb+srv://...
OPENAI_API_KEY=sk-...
JWT_SECRET=your-super-secret
GOOGLE_CLIENT_ID=...
FRONTEND_URL=http://localhost:5173
PORT=5000
```

## 📦 Deployment
1. **Frontend**: Connect to Vercel → Auto-deploy
2. **Backend**: Deploy to Render → Add env vars
3. **Database**: MongoDB Atlas (free tier)

## 🤝 Contributing
1. Fork repo
2. Create feature branch
3. Follow TODO.md
4. PR to `main`

## 📄 License
MIT

---
**Built with ❤️ for job seekers worldwide**

