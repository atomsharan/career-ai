# 🧑‍🏫 Career Advisor — AI-Powered Mentoring & Career Guidance System

Career Advisor is an AI-driven conversational mentoring system designed to help students and early professionals navigate life-changing career decisions through **deep conversation, emotional intelligence, and structured guidance**.

Unlike typical career bots that answer isolated questions, Career Advisor focuses on **understanding the person behind the question**.

---

## 🎯 Problem Statement

Millions of students finish 10th or 12th grade with overwhelming confusion:
- What should I study?
- Which career suits me?
- Is college even worth it?
- What opportunities am I missing?

Most online platforms provide either static content or generic chatbots that:
- forget context,
- fail to adapt emotionally,
- and overwhelm users with options.

---

## 💡 Solution Overview

Career Advisor is designed as a **mentoring-first AI system**.

It listens.
It remembers.
It adapts.
It guides.

Its goal is not just to provide options —  
but to **help users understand themselves and make confident decisions**.

---

## 🧠 Core Philosophy

> People don’t need answers.  
> They need clarity.

Career Advisor provides clarity through conversation.

---

## 🧑‍🎓 Target Users

- 10th & 12th grade students
- College students exploring paths
- First-generation learners
- Career switchers
- Anyone feeling lost about their future

---

## 🛠️ Key Capabilities

### 🗣️ Deep Conversational Mentoring
- Natural language interaction
- Emotion-aware responses
- Non-overwhelming guidance
- Step-by-step discovery of interests

### 🧬 Personality & Interest Discovery
- Adaptive questioning
- Behavioral pattern analysis
- Strength & weakness mapping

### 🧭 Career Exploration
- Domain exploration
- Course & college clarity
- Reality-based career discussion

### 🧘 Human-Centered Tone
- Supportive
- Honest
- Calm
- Encouraging

---

## 🏗️ System Architecture

```
User
  ↓
Frontend (React Chat Interface)
  ↓
Django REST API
  ↓
Conversation Engine
  ├── Emotional Context Analyzer
  ├── Mentoring Logic Core
  ├── Conversation Memory
  └── Career Guidance Module
  ↓
Database (Users, Sessions, Messages, Profiles)
```

---

## 🧰 Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Vite

### Backend
- Django
- Django REST Framework
- JWT Authentication
- SQLite / MySQL

### AI
- OpenAI GPT
- Google Gemini (fallback)
- Custom mentoring prompt framework

---

## 📦 Installation

### Backend Setup
```bash
git clone https://github.com/your-username/career-advisor.git
cd career-advisor
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Running the System

- Backend → http://localhost:8000  
- Frontend → http://localhost:5173

---

## 🧪 Example Flow

1. User joins confused after 12th
2. AI begins gentle conversation
3. Discovers interests & concerns
4. Provides career clarity
5. Prepares user for structured planning (handoff to Navigentha)

---

## 🧩 Why Career Advisor Exists

Because life-changing decisions require:
- trust,
- patience,
- understanding,
- and emotional intelligence.

---

## 🔮 Future Expansion

- Regional language support
- Parent guidance module
- School counselor integration
- Government college awareness
- Scholarship recommendation engine

---

## 🏁 Final Thought

Career Advisor doesn’t just answer questions.  
It **walks with the user until they find direction**.

