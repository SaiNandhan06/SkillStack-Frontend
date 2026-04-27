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
- Java 21 + Spring Boot 3.2.5
- Spring Security + JWT (JJWT)
- Spring Data JPA + Hibernate
- MySQL 8.x (Primary Database)
- Lombok

---

## Prerequisites & Installation

Before running the project, ensure you have the following installed based on your Operating System:

### 🪟 Windows
1. **Java 21 JDK**: Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or install via terminal:
   ```powershell
   winget install Microsoft.OpenJDK.21
   ```
2. **Maven**: Download from [Apache Maven](https://maven.apache.org/download.cgi) or install via terminal:
   ```powershell
   winget install Apache.Maven
   ```
3. **Node.js (v18+)**: Download from [nodejs.org](https://nodejs.org/) or install via terminal:
   ```powershell
   winget install OpenJS.NodeJS.LTS
   ```
4. **MySQL Server**: Download and install [MySQL Community Server](https://dev.mysql.com/downloads/installer/).

### 🐧 Linux (Ubuntu/Debian)
1. **Java 21 JDK**:
   ```bash
   sudo apt update
   sudo apt install openjdk-21-jdk -y
   ```
2. **Maven**:
   ```bash
   sudo apt install maven -y
   ```
3. **Node.js (v18+)**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
4. **MySQL Server**:
   ```bash
   sudo apt install mysql-server -y
   sudo systemctl start mysql
   ```

### 🍎 macOS
1. **Homebrew** (if not installed): `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
2. **Java 21 JDK**: 
   ```bash
   brew install openjdk@21
   ```
3. **Maven**:
   ```bash
   brew install maven
   ```
4. **Node.js**:
   ```bash
   brew install node
   ```
5. **MySQL Server**:
   ```bash
   brew install mysql
   brew services start mysql
   ```

---

## Step-by-Step Running Procedure

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/SaiNandhan06/SkillStack.git
cd SkillStack
```

### 2️⃣ Database Setup (MySQL)
1. Ensure MySQL is running.
2. Log in to MySQL:
   ```sql
   mysql -u root -p
   ```
3. Create the database (if not already created by Spring Boot):
   ```sql
   CREATE DATABASE skillstack_db;
   ```
4. **Important**: Open `skillstack-backend/src/main/resources/application.properties` and verify/update your MySQL credentials:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

### 3️⃣ Run the Backend (Spring Boot)
1. Navigate to the backend directory:
   ```bash
   cd skillstack-backend
   ```
2. Build and run:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
3. The server will start at `http://localhost:8080`.
4. **API Documentation (Swagger)**: You can view and test all available endpoints by visiting the Swagger UI at `http://localhost:8080/swagger-ui/index.html`.

### 4️⃣ Run the Frontend (React + Vite)
1. Open a **new terminal** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The application will be live at `http://localhost:5173`.

---

## Admin Credentials (Dev Seed)
Once the app is running, you can use these credentials for testing:
- **Email**: `admin@skillstack.com`
- **Password**: `Admin123!`

---

## Troubleshooting

- **Port 8080 already in use**: 
  - Windows: `netstat -ano | findstr :8080` then `taskkill /F /PID <PID>`
  - Linux/Mac: `lsof -i :8080` then `kill -9 <PID>`
- **MySQL Connection Failed**: Ensure the `skillstack_db` exists and your `application.properties` has the correct username and password.
- **Node Version**: Ensure `node -v` shows version 18 or higher.

---
**Developed & Designed with modern web standards.**
