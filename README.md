# SkillStack

**A Modern Skill Certification & Career Growth Tracking Platform**

SkillStack is a full-stack platform that tracks skills, certifications, and career goals while providing an admin workflow for verification and user management. The frontend is a React SPA and the backend is a Spring Boot REST API secured with JWT.

---

##  Core Features

- **Authentication Flow:** Fully interactive login and registration components wired with protected routing logic, abstracting `AuthContext` natively to mock server-side JWT workflows.
- **Dynamic Dashboard:** A comprehensive analytical view showing acquisition trends, active certifications, urgent expiry warnings, and aggregated goal progress. 
- **Skill Repository:** Log specialized skills with varying proficiency levels, updating directly inside your dashboard.
- **Certification Management:** Comprehensive date-tracking logic mapping active versus expiring IT certifications dynamically using a color-coding paradigm.
- **Growth Goals (Kanban):** State-driven task management across Not Started, In Progress, and Completed tiers updating global progression points.
- **Algorithmic Notifications:** Auto-generation utility checking dates dynamically and notifying users if a certification is expiring or a goal deadline is fast-approaching (< 14 days warning).
- **Public Profile & Exports:** Configurable developer representation with print-native features parsing directly to PDF without layout bleeding.
- **Global Theme Toggling:** Securely built `.light` and `.dark` scalable theme states mapped perfectly to CSS variables, supporting Framer Motion without visual degradation or layout shifting.
- **Interactive Recharts Analytics:** Visual metric construction rendering Line, Bar, and Area charts to define growth metrics.

---

## Tech Stack

**Frontend**
- React 18 + Vite
- TailwindCSS + custom CSS
- Framer Motion + Lucide React
- React Router
- Axios for API calls
- Context API (`useAuth`, `useTheme`)

**Backend**
- Spring Boot 3
- Spring Security + JWT
- Spring Data JPA
- H2 (dev) or PostgreSQL (runtime)
- Hibernate Validation

---

## Project Workflow

**User flow**
1. Register or log in from the frontend.
2. Frontend stores JWT in `localStorage` and attaches it to API requests.
3. User manages skills, certifications, goals, notifications, and profile settings.

**Admin flow**
1. Log in at `/admin-login`.
2. Admin endpoints require JWT with `ADMIN` role.
3. Admin can verify/reject certifications, send reminders, and manage users.

---

## Clone & Run (Step-by-Step)

**Prerequisites**
- Node.js 18+
- Java 17+ (JDK)
- Maven (or use the Maven wrapper if added later)

**1) Clone the repo**
```bash
git clone https://github.com/SaiNandhan06/SkillStack.git
cd SkillStack
```

**2) Start the backend**
```bash
cd skillstack-backend/skillstack-backend
mvn spring-boot:run
```
Backend runs at `http://localhost:8080`.

**3) Start the frontend**
```bash
cd ../../frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

**Admin login (dev seed)**
- Email: `admin@skillstack.com`
- Password: `Admin123!`

---

## Notes

- API base URL is configured in [frontend/src/api.js](frontend/src/api.js) via `VITE_API_BASE_URL` (defaults to `http://localhost:8080/api/v1`).
- CORS is configured in the backend for `http://localhost:5173` and `http://localhost:3000`.

---

**Developed & Designed carefully with modern web standards.**
