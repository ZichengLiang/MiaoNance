
---

# 🪙 MiaoNance

**MiaoNance** is a smart crypto investment notebook for long-term investors. Inspired by real user workflows, it combines live market data with note-taking features in a modular, Notion-like interface.

---

## 🚀 Project Overview

* 📈 Track real-time crypto data (via Binance API or even our own MCP server)
* 🧾 Take structured notes per coin
* 🧩 Modular card-based canvas UI
* 🧠 Human-centered interface for research and insights

---

## 🧰 Setup

### Backend (Django + Poetry)

```bash
cd backend
poetry install
poetry shell
python manage.py migrate
python manage.py runserver
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```
---

## 👥 Team

| Name    | Role           |
| ------- | -------------- |
| Aryan   | TBD |
| Joel    | TBD |
| Leon    | TBD |
| Zicheng | PM  |

---

## ⚙️ Tech Stack

| Layer    | Tech                         |
| -------- | ---------------------------- |
| Frontend | React, TailwindCSS  |
| Backend  | Django (managed with Poetry) |
| API Data | Binance Spot API             |
| DevOps   | Docker, docker-compose       |
| Deploy   | GCP Cloud Run (planned)      |
| CI/CD    | GitHub Actions               |

---

## 🧱 MVP Features

(TBD)

---

## 📁 Structure

```
miaonance/
├── backend/     # Django project (Poetry-managed)
├── frontend/    # React + Next.js UI
├── docker-compose.yml # (To be implemented)
└── README.md
```

---

