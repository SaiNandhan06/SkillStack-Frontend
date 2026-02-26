# SkillStack 

**A Modern Skill Certification & Career Growth Tracking Platform**

SkillStack is a frontend-first architecture application built to function as an intuitive command center for ambitious professionals. Designed for tracking technology skills, maintaining certification compliance, and visualizing holistic career growth using local progression metrics.

This iteration acts as a highly capable prototype engineered to use browsers' `localStorage` as a seamless, high-performance NoSQL-like temporary database—making it completely functional for frontend review and demonstrations without requiring a backend runtime.

---

## 🌟 Core Features

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

## 🛠️ Tech Stack & Architecture

- **Framework:** React 18 + Vite (High-speed HMR environment)
- **Styling:** TailwindCSS + Vanilla CSS (Glassmorphism & Gradients)
- **Motion & UI:** Framer Motion (Transitions) + Lucide React (Vector iconography)
- **Global State:** Context API (`useAuth`, `useTheme`)
- **Data Persistence:** Custom hooks leveraging `window.localStorage`
- **Data Visualization:** Recharts (SVG-based charting)
- **Routing:** React Router DOM (v6/v7 standards)

---

## 📂 Architecture Breakdown

SkillStack utilizes distinct hook models bypassing the need for JSON mocks, natively formatting objects back to the browser namespace linked directly to the `user.id`.

```text
├── src/
│   ├── components/
│   │   ├── dashboard/       # Dynamic Graphing, Structural App Layouts
│   │   └── landing/         # Marketing, Animated Feature Strips, Pricing
│   ├── context/
│   │   ├── AuthContext.jsx  # Global session verification 
│   │   └── ThemeContext.jsx # Light/Dark mode persistent toggling 
│   ├── hooks/
│   │   ├── useLocalStorageData.js # Array manipulations wrapping the mock DB
│   │   └── useAnalytics.js        # Graph aggregator handling months/point logic
│   ├── pages/
│   │   ├── Certifications.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Goals.jsx
│   │   ├── Login.jsx
│   │   ├── Notifications.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   └── Settings.jsx
│   ├── App.jsx              # Routing Definitions & Guards
│   └── index.css            # Standard Variables + Scalable Theme Overrides
```

---

## 🚀 Installation & Local Execution

**Prerequisites:** 
- Node.js (`v18.0.0+` recommended)

```bash
# Clone the repository and move to directory
git clone https://github.com/your-username/skillstack.git
cd skillstack

# Install foundational dependencies
npm install

# Optional: Ensure additional libraries are updated (e.g., recharts)
npm install recharts framer-motion lucide-react react-router-dom formik yup

# Start the Vite development runtime
npm run dev
```

Navigate to `http://localhost:5173` to experience the deployed environment.

---

## 🔮 Future Integration Pipeline

SkillStack is built modularly. To upgrade the platform from a LocalStorage prototype into a full-scale web application, the data access layer can be trivially refactored:

1. **Backend Endpoints:** Swap out operations inside `useLocalStorageData.js` with `fetch` or `Axios` queries wired up to a Node.js/Express framework.
2. **Database Translation:** Map the currently simulated `skillstack_skills_{userId}` array structures precisely to a MongoDB representation or PostgreSQL schema.
3. **Authentication Overhaul:** Discard the simulated local auth validations for native encrypted OAuth 2.0 or JWT session configurations via `AuthContext.jsx`.

---

**Developed & Designed carefully with modern web standards.**
