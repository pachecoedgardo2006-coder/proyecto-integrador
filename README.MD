<h1 align="center">ConnecTor</h1>

<p align="center">
  <strong>Academic Mentoring Management Platform</strong><br>
  Connecting learners and mentors through intelligent scheduling, progress tracking, and continuous feedback.
</p>

<p align="center">
  <a href="https://git-scm.com/">
    <img src="https://img.shields.io/badge/Monorepo-111111?style=for-the-badge">
  </a>
  <a href="https://www.conventionalcommits.org/">
    <img src="https://img.shields.io/badge/Conventional_Commits-1.0.0-FE5196?style=for-the-badge&logo=conventionalcommits&logoColor=white">
  </a>
</p>

---

<p align="center">
A web platform that allows mentors and learners to schedule tutoring sessions, monitor academic progress, and evaluate mentoring quality in one centralized system.
</p>

---

# Table of Contents

- [Badges](#badges)
- [Features](#features)
- [Project Categories](#project-categories)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Roadmap](#roadmap)
- [Team](#team)
- [Documentation](#documentation)
- [Contributing](#contributing)

---

<div align="center">

# Badges

### Build & Tooling

<p>
<a href="https://vite.dev/">
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white">
</a>

<a href="https://git-scm.com/">
<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white">
</a>

<a href="https://www.atlassian.com/software/jira">
<img src="https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=jira&logoColor=white">
</a>

</p>

### Frontend

<p>

<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">
<img src="https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
</a>

<a href="https://vite.dev/">
<img src="https://img.shields.io/badge/Vite-SPA-646CFF?style=for-the-badge&logo=vite&logoColor=white">
</a>

<a href="https://tailwindcss.com/">
<img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
</a>

</p>

### Backend

<p>

<a href="https://expressjs.com/">
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white">
</a>

<a href="https://www.postgresql.org/">
<img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white">
</a>

<a href="#">
<img src="https://img.shields.io/badge/API-REST-25A162?style=for-the-badge">
</a>

</p>

### Deployment

<p>

<a href="https://vercel.com/">
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">
</a>

<a href="https://github.com/">
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white">
</a>

</p>

</div>

---

# Features

- Secure authentication with role-based access.
- Mentor availability calendar.
- Tutoring session scheduling.
- Academic progress tracking.
- Task management with progress indicators.
- Anonymous mentor evaluations.
- Skill assessment comparison.
- Personal dashboards for mentors and learners.
- RESTful API architecture.
- Responsive SPA interface.

---

# Project Categories

- Education
- Technology & Innovation
- Productivity

---

# Technology Stack

| Layer | Technology |
|---------|------------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla), Vite |
| Styling | Tailwind CSS v4 |
| Backend | Express.js |
| Database | PostgreSQL |
| Version Control | Git & GitHub |
| Project Management | Jira |
| Deployment | Vercel |

---

# Project Structure

```text
ConnecTor/
│
├── apps/
│   ├── frontend/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   ├── layouts/
│   │   │   ├── pages/
│   │   │   ├── router/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   ├── styles/
│   │   │   └── main.js
│   │   ├── index.html
│   │   └── package.json
│   │
│   └── backend/
│       ├── src/
│       │   ├── config/
│       │   ├── controllers/
│       │   ├── middlewares/
│       │   ├── models/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── utils/
│       │   └── app.js
│       │
│       ├── package.json
│       └── server.js
│
├── docs/
│   ├── frontend/
│   ├── backend/
│   ├── database/
│   ├── scrum/
│   └── api/
│
├── README.md
└── .gitignore
```

---

# Quick Start

Clone the repository

```bash
git clone https://github.com/your-organization/connector.git

cd ConnecTor
```

Frontend

```bash
cd apps/frontend

npm install

npm run dev
```

Backend

```bash
cd apps/backend

npm install

npm run dev
```

---

# Environment Variables

Backend

```env
PORT=

DB_HOST=

DB_PORT=

DB_NAME=

DB_USER=

DB_PASSWORD=

JWT_SECRET=
```

---

# Roadmap

## Sprint 1

- Project planning
- Product Backlog
- Database design
- Wireframes
- Software architecture

---

## Sprint 2

- Authentication
- User profiles
- Tutoring scheduling
- Availability calendar
- Backend API
- Database integration

---

## Sprint 3

- Progress tracking
- Evaluations
- Dashboard
- Testing
- Bug fixing
- Deployment
- Documentation

---

# Team

| Role | Member |
|--------|---------|
| Product Owner | |
| Scrum Master | |
| Backend Developer | |
| Backend Developer | |
| Frontend Developer | |
| Frontend Developer | |
| Frontend Developer | |

---

# Documentation

| Document | Status |
|------------|---------|
| Product Requirements Document | ⏳ |
| Software Requirements Specification | ⏳ |
| Architecture | ⏳ |
| Database Design | ⏳ |
| API Documentation | ⏳ |
| User Manual | ⏳ |

---

# Contributing

Every contribution must follow the project's workflow.

- GitFlow strategy
- Conventional Commits
- Pull Requests required
- Code Review before merging
- Jira task linked to every Pull Request

---

<p align="center">

Developed for the **RIWI CodeUp Integrator Project 2026** 🚀

</p>
